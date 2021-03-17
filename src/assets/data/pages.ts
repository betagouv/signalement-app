export interface PageDefinition {
  title: string;
  description: string;
}

export type PageDefinitions = typeof pageDefinitions;

export const pageDefinitions = {
  default: {
    title: 'SignalConso, un service public pour les consommateurs',
    description: 'Signalez un problème au commerçant (magasins, commerces de proximité, cafés et restaurants...) et à la répression des fraudes : pratique d\'hygiène, nourriture / boissons, matériel / objet, prix / paiement, publicité, services associés à l\'achat.'
  },
  about: {
    title: 'Qui sommes-nous ? - SignalConso',
    description: 'SignalConso est un service proposé par la DGCCRF (Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes) au travers d\'une Startup d’État. Il permet à la fois de comprendre ses droits en tant que consommateurs et d’être aidé pour les faire respecter.'
  },
  notfound: {
    title: '404 Page non trouvée - SignalConso',
    description: 'SignalConso est un service proposé par la DGCCRF (Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes) au travers d\'une Startup d’État. Il permet à la fois de comprendre ses droits en tant que consommateurs et d’être aidé pour les faire respecter.'
  },
  unavailable: {
    title: 'Page en maintenance - SignalConso',
    description: 'SignalConso est un service proposé par la DGCCRF (Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes) au travers d\'une Startup d’État. Il permet à la fois de comprendre ses droits en tant que consommateurs et d’être aidé pour les faire respecter.'
  },
  how: {
    title: 'Comment ça marche ? - SignalConso',
    description: 'Vous signalez votre problème en remplissant le formulaire en ligne. Notre équipe contacte l\'entreprise afin de l\'informer de votre signalement. L\'entreprise peut procéder spontanément aux corrections utiles, sans sanction. Votre signalement est enregistré à la répression des fraudes (DGCCRF).'
  },
  faq: {
    title: 'Centre d\'aide - SignalConso',
    description: 'Consultez l\'aide et les questions fréquentes sur SignalConso'
  },
  retractation: {
    title: 'Delai de rétractation ? - SignalConso',
    description: 'Comprenez le délai de rétractation et calculez votre date limite de rétractation'
  },
  accessibilite: {
    title: 'Accessibilité - SignalConso',
    description: 'Rapport d\'accessibilité SignalConso'
  },
  sitemap: {
    title: 'Plan du site - SignalConso',
    description: 'Plan du site'
  },
  cgu: {
    title: 'Conditions générales d\'utilisation - SignalConso',
    description: 'Consultez les conditions générales d\'utilisation'
  },
  blog: {
    title: 'Blog - SignalConso',
    description: 'Les articles du blog de SignalConso'
  },
  stats: {
    title: 'Statistiques - SignalConso',
    description: 'Consultez les statistiques de SignalConso'
  },
  trackingAndPrivacy: {
    title: 'Suivi d\'audience et vie privée - SignalConso',
    description: 'Consultez les informations concernant le suivi d\'audience et le respect de la vie privée sur SignalConso'
  },
  accesstoken: {
    title: 'Accès au compte de l\'entreprise - SignalConso',
    description: 'Rejoindre le compte d\'une entreprise'
  },
  contact: {
    title: 'Contact - SignalConso',
    description: 'Trouvez le bon interlocuteur à contacter sur SignalConso'
  },
  account_login: {
    title: 'Authentification - SignalConso',
    description: 'Authentifiez-vous et accédez à votre espace personnel sur SignalConso'
  },
  account_emailValidation: {
    title: 'Validation email - SignalConso',
    description: 'Validation de votre email utilisateur sur SignalConso'
  },
  account_activation: {
    title: 'Activation de l\'espace entreprise - SignalConso',
    description: 'Activez votre espace entreprise sur SignalConso'
  },
  login_forgotPassword: {
    title: 'Mot de passe oublié - SignalConso',
    description: 'Réinitialisez le mot de passe d\'accès à votre espace personnel sur SignalConso'
  },
  login_resetPassword: {
    title: 'Nouveau mot de passe - SignalConso',
    description: 'Réinitialisez le mot de passe d\'accès à votre espace personnel sur SignalConso'
  },
  report_problem: {
    title: 'Le problème - SignalConso',
    description: 'Précisez le problème associé à votre signalement sur SignalConso'
  },
  report_details: {
    title: 'La description - SignalConso',
    description: 'Apportez des détails à votre signalement sur SignalConso'
  },
  report_company: {
    title: 'L\'entreprise - SignalConso',
    description: 'Identifiez l\'entreprise concernée par votre signalement sur SignalConso'
  },
  report_consumer: {
    title: 'Le consommateur - SignalConso',
    description: 'Renseignez vos coordonnées pour authentifier votre signalement sur SignalConso'
  },
  report_confirmation: {
    title: 'Confirmation - SignalConso',
    description: 'Confirmez votre signalement sur SignalConso'
  },
  report_information: {
    title: 'Information - SignalConso',
    description: 'Page d\'information concernant votre signalement sur SignalConso'
  },
  reports_detail: {
    title: 'Détail du signalement - SignalConso',
    description: 'Consultez le détail du signalement sur SignalConso'
  },
  reports_list: {
    title: 'Suivi des signalements - SignalConso',
    description: 'Consultez les signalements qui vous concernent sur SignalConso'
  },
  reports_review: {
    title: 'Donnez votre avis - SignalConso',
    description: 'Donnez votre avis sur la réponse de l\'entreprise à votre signalement sur SignalConso'
  },
  websites_manage: {
    title: 'Modération des sites webs - SignalConso',
    description: 'Modérer les sites webs suggérés'
  },
  websites_unregistered: {
    title: 'Sites internet non identifiés - SignalConso',
    description: 'Consultez la liste des sites internet signalés qui ne sont pas rattachés à une entreprise'
  },
  reportedPhones: {
    title: 'Suivi des numéros de téléphones signalés - SignalConso',
    description: 'Consultez la liste des numéros de téléphone signalés'
  },
  companies_myCompanies: {
    title: 'Mes entreprises - SignalConso',
    description: 'Liste des entreprises rattachées à votre espace personnel sur SignalConso'
  },
  companies_companyAccesses: {
    title: 'Gestion des accès - SignalConso',
    description: 'Gestion des accès au compte de l\'entreprise sur SignalConso'
  },
  companies_companyInvitation: {
    title: 'Accès au compte de l\'entreprise - SignalConso',
    description: 'Ajout d\'un accès au compte de l\'entreprise'
  },
  companies_companiesAdmin: {
    title: 'Entreprises - SignalConso',
    description: 'Suivi des entreprises signalées sur SignalConso'
  },
  contractualDispute: {
    title: 'Résolution d\'un problème individuel (litige) - SignalConso',
    description: 'Démarches conseillées par SignalConso pour résoudre un problème individuel (litige) avec une entreprise '
  },
  secured_dgccrf: {
    title: 'Mode d\'emploi DGCCRF - SignalConso',
    description: 'Mode d\'emploi pour le profil back-office DGCCRF'
  },
  secured_account_changePassword: {
    title: 'Changement de mot de passe - SignalConso',
    description: 'Changez votre mot de passe d\'accès à votre espace personnel sur SignalConso'
  },
  secured_account_activation: {
    title: 'Activation du compte - SignalConso',
    description: 'Activez votre compte pour accéder à votre espace personnel sur SignalConso'
  },
  secured_subscriptions: {
    title: 'Abonnements - SignalConso',
    description: 'Abonnez-vous pour recevoir les signalements qui vous concernent'
  },
  secured_downloads: {
    title: 'Téléchargements - SignalConso',
    description: 'Mes téléchargements'
  },
  secured_admin: {
    title: 'Admin - SignalConso',
    description: 'Invitation à rejoindre SignalConso (DGCCRF)'
  }
};
