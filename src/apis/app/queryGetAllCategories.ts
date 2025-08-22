import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

export const getAllCategoriesQueryOptions = () => {
  const selectedLanguage = i18n.language;

  return queryOptions({
    queryKey: ["all-categories"],
    queryFn: () =>
      API_CLIENT.GET("/api/v1/type/list", {
        params: {
          header: {
            "Accept-Language":
              LANGUAGES_API_HEADER[
                selectedLanguage as keyof typeof LANGUAGES_API_HEADER
              ],
          },
        },
      }),
  });
};

type UseGetAllCategoriesOptions = {
  queryConfig?: QueryConfig<typeof getAllCategoriesQueryOptions>;
};

export const useGetAllCategories = ({
  queryConfig,
}: UseGetAllCategoriesOptions) => {
  const data = useQuery({
    ...getAllCategoriesQueryOptions(),
    ...queryConfig,
  });

  const allCategories = data.data?.data?.data;

  return { ...data, allCategories };
};
