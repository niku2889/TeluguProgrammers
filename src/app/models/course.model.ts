export class courseModel {
    id!: string;
    title!: string;
    description!: string;
    links!: {
        id: string;
        title: string;
        duration: string;
        type: string;
        link: string;
        fileName:string;
    }[];
}