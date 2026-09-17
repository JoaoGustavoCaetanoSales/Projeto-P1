import { DataSource } from "typeorm"
import { Situation } from "../entity/Situations"

export default class CreateSituationsSeeds {

    public async run (dataSource: DataSource):Promise<void>{
        console.log("Iniciando o seed para a tabela 'situations'...")

        const situationRepositoy = dataSource.getRepository(Situation);

        const existingCount = await situationRepositoy.count()

        if(existingCount > 0){
            console.log("A tabela 'situations' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const situations = [
            {nameSituation: "Ativo"},
            {nameSituation: "Inativo"},
            {nameSituation: "Pendente"},
        ]

        
        await situationRepositoy.save(situations);

        console.log("Seed concluído com sucesso: situação cadastradas!");

    }


}