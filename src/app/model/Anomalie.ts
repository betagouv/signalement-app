export class Anomalie {
  typeEtablissement: string;
  typeAnomalieList: TypeAnomalie[];

  constructor(typeEtablissement: string, typeAnomalieList: TypeAnomalie[]) {
    this.typeEtablissement = typeEtablissement;
    this.typeAnomalieList = typeAnomalieList;
  }
}

export class TypeAnomalie {
  categorie: string;
  precisionList: string[];

  constructor(categorie: string, precisionList: string[]) {
    this.categorie = categorie;
    this.precisionList = precisionList;
  }
}
