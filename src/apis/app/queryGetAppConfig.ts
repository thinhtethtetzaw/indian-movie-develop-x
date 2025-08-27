import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

export const getAppConfigQueryOptions = () => {
  const selectedLanguage = i18n.language;

  return queryOptions({
    queryKey: ["config-list", selectedLanguage],
    queryFn: () =>
      API_CLIENT.GET("/api/v1/config/data" as any, {
        headers: {
          "Accept-Language":
            LANGUAGES_API_HEADER[
              selectedLanguage as keyof typeof LANGUAGES_API_HEADER
            ],
        },
      }),
  });
};

type UseGetAppConfigOptions = {
  queryConfig?: QueryConfig<typeof getAppConfigQueryOptions>;
};

export const useGetAppConfig = ({
  queryConfig,
}: UseGetAppConfigOptions = {}) => {
  const data = useQuery({
    ...getAppConfigQueryOptions(),
    ...queryConfig,
  });

  const appConfig = data.data?.data?.data as
    | { share_link?: string }
    | undefined;

  return { ...data, appConfig };
};
