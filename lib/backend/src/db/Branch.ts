import { Branch, HttpError } from "../model";
import getConnection from "./connection";



const createBranch = async (branch: Branch.Model) => {
    const knex = getConnection();
    try {
        const [newBranch] = await knex('yaazoru.branches')
            .insert({
                city: branch.city,
                address: branch.address,
                manager_name: branch.manager_name,
                phone_number: branch.phone_number,
                additional_phone: branch.additional_phone,
            }).returning('*');
        return newBranch;
    }
    catch (err) {
        throw err;
    };
}

const getBranches = async (): Promise<Branch.Model[]> => {
    const knex = getConnection();
    try {
        return await knex.select().table('yaazoru.branches');
    }
    catch (err) {
        throw err;
    };
}

const getBranchById = async (branch_id: string) => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.branches').where({ branch_id }).first();
    } catch (err) {
        throw err;
    };
};

const getBranchesByCity = async (city: string) => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.branches')
            .select()
            .where({ city });
    } catch (err) {
        throw err;
    };
};

const updateBranch = async (branch_id: string, branch: Branch.Model) => {
    const knex = getConnection();
    try {
        const updateBranch = await knex('yaazoru.branches')
            .where({ branch_id })
            .update(branch)
            .returning('*');
        if (updateBranch.length === 0) {
            throw { status: 404, message: 'branch not found' };
        }
        return updateBranch[0];
    } catch (err) {
        throw err;
    };
};

const deleteBranch = async (branch_id: string) => {
    const knex = getConnection();
    try {
        const updateBranch = await knex('yaazoru.branches')
            .where({ branch_id })
            .update({ status: 'inactive' })
            .returning('*');
        if (updateBranch.length === 0) {
            const error: HttpError.Model = {
                status: 404,
                message: 'Branch not found'
            }
            throw error;
        }
        return updateBranch[0];
    } catch (err) {
        throw err;
    }
};

const doesBranchExist = async (branch_id: string): Promise<boolean> => {
    const knex = getConnection();
    try {
        const result = await knex('yaazoru.branches')
            .select('branch_id')
            .where({ branch_id })
            .first();
        return !!result;
    } catch (err) {
        throw err;
    }
};

export {
    createBranch,
    getBranches,
    getBranchById,
    getBranchesByCity,
    updateBranch,
    deleteBranch,
    doesBranchExist
}
