export const ReportingDateLabel = 'Date du constat';
export const ReportingTimeslotLabel = 'Heure du constat';
export const DescriptionLabel = 'Description';
export const ContractualDisputeTag = 'Litige contractuel';
export const InternetTag = 'Internet';
export const ReponseConsoTag = 'ReponseConso';

export interface SubcategoryBase extends Category {
  title: string;
  description?: string;
  tags?: Tag[];
  example?: string;
}

export interface Anomaly extends Category {
  category: string;
  categoryId: string;
  path: string;
  description?: string;
  rank?: number;
  sprite?: string;
  hidden?: boolean;
  information?: Information;
  breadcrumbTitle?: string;
}

export type Subcategory = SubcategoryBase | SubcategoryInput | SubcategoryInformation;

export type Tag = string;

export enum CompanyKinds {
  SIRET = 'SIRET',
  WEBSITE = 'WEBSITE',
  PHONE = 'PHONE',
  LOCATION = 'LOCATION',
}

export interface Category {
  subcategoriesTitle?: string;
  subcategories?: Subcategory[];
  companyKind?: string;
}

export interface SubcategoryInput extends SubcategoryBase {
  detailTitle?: string;
  fileLabel: string;
  detailInputs?: DetailInput[];
}

export interface SubcategoryInformation extends SubcategoryBase {
  information: Information;
}

export interface Information {
  title?: string;
  content?: string;
  actions?: Action[];
  subTitle?: string;
  outOfScope?: boolean;
}

export interface Action {
  question: string;
  example?: string;
  answer: string;
}

export interface DetailInput {
  label: string;
  rank: number;
  type: string;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  example?: string;
  optionnal?: boolean;
}

export enum InputType {
  Text = 'TEXT',
  Radio = 'RADIO',
  Checkbox = 'CHECKBOX',
  Textarea = 'TEXTAREA',
  Timeslot = 'TIMESLOT',
  Date = 'DATE'
}

const askCompanyKindIfMissing = (anomaly: Category): Category => {
  if (!anomaly.subcategories && !anomaly.companyKind && !instanceOfSubcategoryInformation(anomaly)) {
    return {
      ...anomaly,
      description: undefined,
      subcategoriesTitle: 'Est-ce que votre problème concerne une entreprise sur internet ?',
      subcategories: [
        {
          ...anomaly,
          title: 'Oui',
          companyKind: CompanyKinds.WEBSITE,
          example: undefined
        }, {
          ...anomaly,
          title: 'Non, pas sur internet',
          companyKind: CompanyKinds.SIRET,
          example: undefined
        },
      ]
    } as Category;
  }
  return {
    ...anomaly,
    subcategories: anomaly.subcategories?.map(_ => ({ ..._, ...askCompanyKindIfMissing(_) })),
  };
};

const propagateCompanyKinds = (anomaly: Category): Category => {
  return {
    ...anomaly,
    subcategories: anomaly.subcategories
      ?.map(_ => ({ ..._, companyKind: _.companyKind || anomaly.companyKind, }))
      ?.map(_ => ({ ..._, ...propagateCompanyKinds(_), }))
  };
};

export const enrichAnomaly = (_: Category): Category => askCompanyKindIfMissing(propagateCompanyKinds(_));

export const instanceOfSubcategoryInput = (_?: Category): _ is SubcategoryInput => {
  return !!(_ as SubcategoryInput)?.detailInputs;
};

export const instanceOfSubcategoryInformation = (_?: Category): _ is SubcategoryInformation => {
  return !!(_ as SubcategoryInformation)?.information;
};
export const instanceOfAnomaly = (_?: Category): _ is Anomaly => {
  return !!(_ as Anomaly)?.category;
};
