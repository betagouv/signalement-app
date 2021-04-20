export const environment = {
  production: true,
  apiReportBaseUrl: '${API_BASE_URL}',
  apiCompanyBaseUrl: 'https://entreprise.data.gouv.fr',
  apiAddressBaseUrl: 'https://api-adresse.data.gouv.fr',
  reponseConsoDisplayRate: Number('${REPONSECONSO_DISPLAY_PERCENTAGE}') || 0,
  sentryDsn: '${SENTRY_DSN}',
};
