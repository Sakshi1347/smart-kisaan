import { supabase } from "@/integrations/supabase/client";
import { getLocalSchemeCatalog } from "@/lib/localSchemeCatalog";
import { PHASE1 } from "@/lib/phase1";
import { useQuery } from "@tanstack/react-query";

export interface SchemeRow {
  id: string;
  external_id: string | null;
  title: string;
  description: string;
  category: string;
  state: string;
  eligibility: string | null;
  benefits: string[];
  benefit_type: string;
  status: string;
  ministry: string | null;
  max_benefit: string | null;
  application_deadline: string | null;
  website_url: string | null;
  created_at: string;
  title_hi?: string;
  short_code?: string;
  description_hi?: string;
  eligibility_hi?: string;
  benefits_hi?: string[];
  documents?: string[];
  documents_hi?: string[];
  verification_note?: string;
  verification_note_hi?: string;
  official_portal_name?: string;
  requires_local_confirmation?: boolean;
}

const MINIMUM_SCHEME_CATALOG_SIZE = 200;
const ALL_CATEGORIES_FILTER = "ALL_CATEGORIES";
const ALL_STATES_FILTER = "ALL_STATES";

function normalizeSchemeRow(scheme: SchemeRow): SchemeRow {
  return {
    ...scheme,
    benefits: Array.isArray(scheme.benefits) ? scheme.benefits : [],
    eligibility: scheme.eligibility ?? null,
    ministry: scheme.ministry ?? null,
    max_benefit: scheme.max_benefit ?? null,
    application_deadline: scheme.application_deadline ?? null,
    website_url: scheme.website_url ?? null,
  };
}

function applySchemeFilters(
  schemes: SchemeRow[],
  filters?: {
    category?: string;
    state?: string;
    benefitType?: string;
    search?: string;
  },
) {
  const normalizedSearch = filters?.search?.trim().toLowerCase();
  const normalizedCategory = filters?.category?.trim();
  const normalizedState = filters?.state?.trim();
  const normalizedBenefitType = filters?.benefitType?.trim();

  return schemes.filter((scheme) => {
    if (
      normalizedCategory &&
      normalizedCategory !== "All Categories" &&
      normalizedCategory !== ALL_CATEGORIES_FILTER &&
      scheme.category !== normalizedCategory
    ) {
      return false;
    }

    if (
      normalizedState &&
      normalizedState !== "All States" &&
      normalizedState !== ALL_STATES_FILTER &&
      scheme.state !== normalizedState
    ) {
      return false;
    }

    if (normalizedBenefitType && scheme.benefit_type !== normalizedBenefitType) {
      return false;
    }

    if (normalizedSearch) {
      const haystack = [
        scheme.title,
        scheme.title_hi ?? "",
        scheme.short_code ?? "",
        scheme.description,
        scheme.description_hi ?? "",
        scheme.category,
        scheme.state,
        scheme.benefit_type,
        scheme.eligibility ?? "",
        scheme.eligibility_hi ?? "",
        scheme.ministry ?? "",
        scheme.official_portal_name ?? "",
        ...(scheme.benefits ?? []),
        ...(scheme.benefits_hi ?? []),
        ...(scheme.documents ?? []),
        ...(scheme.documents_hi ?? []),
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(normalizedSearch)) {
        return false;
      }
    }

    return true;
  });
}

function mergeWithFallbackSchemes(remoteSchemes: SchemeRow[]) {
  if (remoteSchemes.length >= MINIMUM_SCHEME_CATALOG_SIZE) {
    return remoteSchemes.map(normalizeSchemeRow);
  }

  const merged = new Map<string, SchemeRow>();

  for (const scheme of remoteSchemes.map(normalizeSchemeRow)) {
    const key = scheme.external_id ?? scheme.id;
    merged.set(key, scheme);
  }

  for (const scheme of getLocalSchemeCatalog().map(normalizeSchemeRow)) {
    const key = scheme.external_id ?? scheme.id;
    if (!merged.has(key)) {
      merged.set(key, scheme);
    }
  }

  return [...merged.values()].sort((a, b) => a.title.localeCompare(b.title));
}

export function useSchemes(filters?: {
  category?: string;
  state?: string;
  benefitType?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["schemes", filters, PHASE1.preferLocalSchemeCatalog],
    queryFn: async () => {
      const localFiltered = () =>
        applySchemeFilters(getLocalSchemeCatalog().map(normalizeSchemeRow), filters);

      // Current demo: local catalog only so demos work without Supabase.
      if (PHASE1.preferLocalSchemeCatalog) {
        return localFiltered();
      }

      try {
        let query = supabase
          .from("schemes")
          .select("*")
          .eq("status", "active")
          .order("title");

        if (
          filters?.category &&
          filters.category !== "All Categories" &&
          filters.category !== ALL_CATEGORIES_FILTER
        ) {
          query = query.eq("category", filters.category);
        }
        if (
          filters?.state &&
          filters.state !== "All States" &&
          filters.state !== ALL_STATES_FILTER
        ) {
          query = query.eq("state", filters.state);
        }
        if (filters?.benefitType) {
          query = query.eq("benefit_type", filters.benefitType);
        }
        if (filters?.search) {
          query = query.ilike("title", `%${filters.search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return applySchemeFilters(mergeWithFallbackSchemes((data as SchemeRow[]) ?? []), filters).sort((a, b) =>
          a.title.localeCompare(b.title),
        );
      } catch (error) {
        console.warn("Falling back to local scheme catalog because Supabase schemes query failed.", error);
        return localFiltered();
      }
    },
  });
}

export function useSchemeCategories() {
  return useQuery({
    queryKey: ["scheme-categories", PHASE1.preferLocalSchemeCatalog],
    queryFn: async () => {
      let merged: SchemeRow[];

      if (PHASE1.preferLocalSchemeCatalog) {
        merged = getLocalSchemeCatalog().map(normalizeSchemeRow);
      } else {
        try {
          const { data, error } = await supabase
            .from("schemes")
            .select("*")
            .eq("status", "active");
          if (error) throw error;
          merged = mergeWithFallbackSchemes((data as SchemeRow[]) ?? []);
        } catch (error) {
          console.warn("Falling back to local categories because Supabase schemes query failed.", error);
          merged = getLocalSchemeCatalog().map(normalizeSchemeRow);
        }
      }

      const cats = [...new Set(merged.map((scheme) => scheme.category))].sort();
      return cats;
    },
  });
}

export function useSchemeStates() {
  return useQuery({
    queryKey: ["scheme-states", PHASE1.preferLocalSchemeCatalog],
    queryFn: async () => {
      let merged: SchemeRow[];

      if (PHASE1.preferLocalSchemeCatalog) {
        merged = getLocalSchemeCatalog().map(normalizeSchemeRow);
      } else {
        try {
          const { data, error } = await supabase
            .from("schemes")
            .select("*")
            .eq("status", "active");
          if (error) throw error;
          merged = mergeWithFallbackSchemes((data as SchemeRow[]) ?? []);
        } catch (error) {
          console.warn("Falling back to local states because Supabase schemes query failed.", error);
          merged = getLocalSchemeCatalog().map(normalizeSchemeRow);
        }
      }

      const states = [...new Set(merged.map((scheme) => scheme.state))].sort();
      return states;
    },
  });
}
