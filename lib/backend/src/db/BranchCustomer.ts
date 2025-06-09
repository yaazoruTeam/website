import { BranchCustomer } from "../model";
import getConnection from "./connection";
import * as dotenv from 'dotenv';
dotenv.config();
const limit = Number(process.env.LIMIT) || 10;

const createBranchCustomer = async (branchCustomer: BranchCustomer.Model) => {
    const knex = getConnection();
    try {
        const [newBranchCustomer] = await knex('yaazoru.branchCustomer')
            .insert({
                branch_id: branchCustomer.branch_id,
                customer_id: branchCustomer.customer_id,
            }).returning('*');
        return newBranchCustomer;
    }
    catch (err) {
        throw err;
    };
}

const getAllBranchCustomer = async (offset: number): Promise<{ branchCustomers: BranchCustomer.Model[], total: number }> => {
    const knex = getConnection();
    try {
        const branchCustomers = await knex('yaazoru.branchCustomer')
            .select('*')
            .orderBy('branchCustomer_id')
            .limit(limit)
            .offset(offset);

        const [{ count }] = await knex('yaazoru.branchCustomer').count('*');
        return {
            branchCustomers,
            total: parseInt(count as string, 10)
        };
    } catch (err) {
        throw err;
    }
};

const getBranchCustomerById = async (branchCustomer_id: string) => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.branchCustomer').where({ branchCustomer_id }).first();
    } catch (err) {
        throw err;
    };
};

const getBranchCustomerByBranc_id = async (branch_id: string, offset: number): Promise<{ branchCustomers: BranchCustomer.Model[], total: number }> => {
    const knex = getConnection();
    try {
        const branchCustomers = await knex('yaazoru.branchCustomer')
            .select('*')
            .where({ branch_id })
            .orderBy('branchCustomer_id')
            .limit(limit)
            .offset(offset);

        const [{ count }] = await knex('yaazoru.branchCustomer')
            .where({ branch_id })
            .count('*');

        return {
            branchCustomers,
            total: parseInt(count as string, 10)
        };
    } catch (err) {
        throw err;
    }
};

const getBranchCustomerByCuseomer_id = async (customer_id: string, offset: number): Promise<{ branchCustomers: BranchCustomer.Model[], total: number }> => {
    const knex = getConnection();
    try {
        const branchCustomers = await knex('yaazoru.branchCustomer')
            .select('*')
            .where({ customer_id })
            .orderBy('branchCustomer_id')
            .limit(limit)
            .offset(offset);

        const [{ count }] = await knex('yaazoru.branchCustomer')
            .where({ customer_id })
            .count('*');

        return {
            branchCustomers,
            total: parseInt(count as string, 10)
        };
    } catch (err) {
        throw err;
    }
};

const updateBranchCustomer = async (branchCustomer_id: string, branchCustomer: BranchCustomer.Model) => {
    const knex = getConnection();
    try {
        const updateBranchCustomer = await knex('yaazoru.branchCustomer')
            .where({ branchCustomer_id })
            .update(branchCustomer)
            .returning('*');
        if (updateBranchCustomer.length === 0) {
            throw { status: 404, message: 'branchCustomer not found' };
        }
        return updateBranchCustomer[0];
    } catch (err) {
        throw err;
    };
};

const deleteBranchCustomer = async (branchCustomer_id: string) => {
    const knex = getConnection();
    try {
        const deleteBranchCustomer = await knex('yaazoru.branchCustomer').where({ branchCustomer_id }).del().returning('*');
        if (deleteBranchCustomer.length === 0) {
            throw { status: 404, message: 'BranchCustomer not found' };
        }
        return deleteBranchCustomer[0];
    } catch (err) {
        throw err;
    };
};

const doesBranchCustomerExist = async (branchCustomer_id: string): Promise<boolean> => {
    const knex = getConnection();
    try {
        const result = await knex('yaazoru.branchCustomer')
            .select('branchCustomer_id')
            .where({ branchCustomer_id })
            .first();
        return !!result;
    } catch (err) {
        throw err;
    }
};

const doesBranchExist = async (branch_id: string): Promise<boolean> => {
    const knex = getConnection();
    try {
        const result = await knex('yaazoru.branchCustomer')
            .select('branch_id')
            .where({ branch_id })
            .first();
        return !!result;
    } catch (err) {
        throw err;
    }
};

const doesCustomerExist = async (customer_id: string): Promise<boolean> => {
    const knex = getConnection();
    try {
        const result = await knex('yaazoru.branchCustomer')
            .select('customer_id')
            .where({ customer_id })
            .first();
        return !!result;
    } catch (err) {
        throw err;
    }
};

const doesBranchCustomerCombinationExist = async (branch_id: string, customer_id: string): Promise<boolean> => {
    const knex = getConnection();
    try {
        const result = await knex('yaazoru.branchCustomer')
            .select('branch_id', 'customer_id')
            .where({ branch_id, customer_id })
            .first();
        return !!result;
    } catch (err) {
        throw err;
    }
};

export {
    createBranchCustomer,
    getAllBranchCustomer,
    getBranchCustomerById,
    getBranchCustomerByBranc_id,
    getBranchCustomerByCuseomer_id,
    updateBranchCustomer,
    deleteBranchCustomer,
    doesBranchCustomerExist,
    doesBranchExist,
    doesCustomerExist,
    doesBranchCustomerCombinationExist,
}
