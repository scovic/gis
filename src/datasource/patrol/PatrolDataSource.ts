import DatabaseDataSource from "../DatabaseDataSource";
import { IPatrolDataSource, PatrolData } from "./IPatrolDataSource";

export class PatrolDataSourceError extends Error {
    constructor (message: string) {
        super(`[PatrolDataSource] Error - ${message}`);
    }
}

export default class PatrolDataSource extends DatabaseDataSource implements IPatrolDataSource {
    private readonly _tableName = "patrol"

    public async createPatrol (patrolInput: PatrolData): Promise<PatrolData> {
        try {
            const [patrolRow] = await this.knex(this._tableName)
                .insert({
                    id: patrolInput.id,
                    status: patrolInput.status,
                    start: new Date(Number(patrolInput.start)),
                    end: new Date(Number(patrolInput.end))
                })
                .returning("*");
            
            return this._convertToPatrolData(patrolRow);
        } catch (err: any) {
            throw new PatrolDataSourceError(err.message);
        }
    }

    public async updatePatrol (patrol: PatrolData): Promise<PatrolData> {
        const { id, ...rest } = patrol;
        try {
            const patrolRow = await this.knex(this._tableName)
                .where({ id })
                .update({
                    status: rest.status,
                    start: new Date(Number(rest.start)),
                    end: new Date(Number(rest.end))
                })
                .returning("*");

            return this._convertToPatrolData(patrolRow);
        } catch (err: any) {
            throw new PatrolDataSourceError(err.message);
        }
    }

    public async getPatrol (id: string): Promise<PatrolData> {
        try {
            const patrolRow = await this.knex(this._tableName)
                .select("*")
                .where({ id })
                .first();

            return patrolRow && this._convertToPatrolData(patrolRow);
        } catch (err: any) {
            throw new PatrolDataSourceError(err.message);
        }
    }

    private _convertToPatrolData (patrolRow: any): PatrolData {
        return {
            id: patrolRow.id,
            status: patrolRow.status,
            start: patrolRow.start,
            end: patrolRow.end
        };
    }   
}
