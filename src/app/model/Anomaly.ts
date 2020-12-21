export const ReportingDateLabel = 'Date du constat';
export const ReportingTimeslotLabel = 'Heure du constat';
export const DescriptionLabel = 'Description';
export const ContractualDisputeTag = 'Litige contractuel';
export const InternetTag = 'Internet';

interface SubcategoryBase extends Category {
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
  WEBSITE = 'WEBSITE'
}

interface Category {
  subcategoriesTitle?: string;
  subcategories?: Subcategory[];
  companyKind?: string;
}

interface SubcategoryInput extends SubcategoryBase {
  detailTitle?: string;
  fileLabel: string;
  detailInputs?: DetailInput[];
}

interface SubcategoryInformation extends SubcategoryBase {
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

export const enrichAnomaly = (anomalies: Anomaly): Anomaly => {
  if (anomalies?.subcategories) {
    anomalies.subcategories = anomalies.subcategories.map(_ => ({
      ..._,
      companyKind: _.companyKind || anomalies.companyKind,
    }));
    return anomalies;
  }
  if (anomalies && !anomalies.companyKind) {
    return {
      ...anomalies,
      subcategoriesTitle: 'Est-ce que votre problème concerne une entreprise sur internet ?',
      subcategories: [
        {
          title: 'Oui',
          companyKind: CompanyKinds.WEBSITE,
          example: undefined
        }, {
          title: 'Non, pas sur internet',
          companyKind: CompanyKinds.SIRET,
          example: undefined
        },
      ]
    };
  }
};

export const instanceOfSubcategoryInput = (_?: SubcategoryBase): _ is SubcategoryInput => {
  return !!(_ as SubcategoryInput)?.detailInputs;
};

export const instanceOfSubcategoryInformation = (_?: SubcategoryBase): _ is SubcategoryInformation => {
  return !!(_ as SubcategoryInformation)?.information;
};
