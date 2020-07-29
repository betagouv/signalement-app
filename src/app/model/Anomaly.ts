export const ReportingDateLabel = 'Date du constat';
export const ReportingTimeslotLabel = 'Heure du constat';
export const DescriptionLabel = 'Description';

export class Action {
  question: string;
  example?: string;
  answer: string;
}

export class Information {
  title?: string;
  content?: string;
  actions?: Action[];
  reference?: string;
  outOfScope?: boolean;
}

export class DetailInput {
  label: string;
  rank: number;
  type: string;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  example?: string;
  optionnal?: boolean;
}

export class WithSubcategories {
  subcategoriesTitle?: string;
  companyKind?: string;
  subcategories: Subcategory[];

  getSubcategoriesData() {
    if (this.subcategories) {
      return {
        subcategoriesTitle: this.subcategoriesTitle,
        subcategories: this.subcategories.map(s => {
          s = Object.assign(new Subcategory(), s, { companyKind: s.companyKind || this.companyKind });
          s = Object.assign(s, s.getSubcategoriesData());
          return s;
        })
      };
    } else if (!this.companyKind) {
      return this.getInternetSubcategoriesData();
    }
  }

  getInternetSubcategoriesData() {
    return {
      subcategoriesTitle: 'Est-ce que votre problème fait suite à un achat sur internet ?',
      subcategories: [
        Object.assign(new Subcategory(), this,
          {
            title: 'Oui',
            companyKind: CompanyKinds.WEBSITE,
            example: undefined
          }),
        Object.assign(new Subcategory(), this, {
          title: 'Non, pas sur internet',
          companyKind: CompanyKinds.SIRET,
          example: undefined
        }),
      ]
    };
  }
}

export class Subcategory extends WithSubcategories {
  title: string;
  description?: string;
  example?: string;
  detailTitle?: string;
  detailInputs?: DetailInput[];
  fileLabel?: string;
  information?: Information;
  consumerActions?: Information[];

  getInternetSubcategoriesData() {
    return {...super.getInternetSubcategoriesData(), description: undefined };
  }
}

export class Anomaly extends WithSubcategories {
  category: string;
  categoryId: string;
  path: string;
  hidden?: boolean;
  description?: string;
  rank?: number;
  sprite?: string;
  information?: Information;
  breadcrumbTitle?: string;
}

export enum InputType {
  Text = 'TEXT',
  Radio = 'RADIO',
  Checkbox = 'CHECKBOX',
  Textarea = 'TEXTAREA',
  Timeslot = 'TIMESLOT',
  Date = 'DATE'
}

export enum CompanyKinds {
  SIRET = 'SIRET', WEBSITE = 'WEBSITE'
}
