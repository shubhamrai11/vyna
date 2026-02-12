export class Phase {
	nom?:string;
	dateDebut?:string = '';
	dateFinPrevue?:string = '';
	montant?:string = '';
	description?:string = '';
	valid: boolean = false;
}

export class ImageProjet {
	description?:string;
	defaultImage: boolean = false;
	file?:string = '';
	valid: boolean = false;
}

export class DocumentProjet {
	nomDocument?:string;
	description?:string = '';
	dateLimite?:string = '';
	valid: boolean = false;
}

export class PlanPaiement {
	nom?:string;
	dateDebut?:string = '';
	dateFinPrevue?:string = '';
	montant?:string = '';
	description?:string = '';
	valid: boolean = false;
}

export class BienProjet {
	nom?:string;
	dateDebut?:string = '';
	dateFinPrevue?:string = '';
	montant?:string = '';
	description?:string = '';
	valid: boolean = false;
}