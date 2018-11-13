import { JsonProperty } from 'json-typescript-mapper';

export class Signalement {

  @JsonProperty('typeEtablissement')
  typeEtablissement: string;
  @JsonProperty('typeAnomalie')
  typeAnomalie: string;
  @JsonProperty('categorieAnomalie')
  categorieAnomalie: string;
  @JsonProperty('precisionAnomalie')
  precisionAnomalie: string;
  @JsonProperty('nomEtablissement')
  nomEtablissement: string;
  @JsonProperty('adresseEtablissement')
  adresseEtablissement: string;
  @JsonProperty('description')
  description: string;
  @JsonProperty('prenom')
  prenom: string;
  @JsonProperty('nom')
  nom: string;
  @JsonProperty('email')
  email: string;
  @JsonProperty('photo')
  photo: string;

  constructor() {
    this.typeEtablissement = undefined;
    this.categorieAnomalie = undefined;
    this.precisionAnomalie = undefined;
    this.nomEtablissement = undefined;
    this.adresseEtablissement = undefined;
    this.description = undefined;
    this.prenom = undefined;
    this.nom = undefined;
    this.email = undefined;
    this.photo = undefined;
  }
}
