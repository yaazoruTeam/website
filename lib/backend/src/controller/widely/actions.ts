import { NextFunction, Request, Response } from 'express'
import { HttpError, Widely } from '@/model/src'
import { callingWidely } from '@/integration/widely/callingWidely'
import { validateRequiredParam, validateWidelyResult } from '@/utils/widelyValidation'
import { sendMobileAction } from '@/integration/widely/widelyActions'
import { config } from '@/config'

const terminateMobile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    validateRequiredParam(endpoint_id, 'endpoint_id')

    const result: Widely.Model = await callingWidely(
      'prov_terminate_mobile',
      { endpoint_id: endpoint_id }
    )
    res.status(result.error_code).json(result)
  } catch (error: any) {
    next(error)
  }
}

const provResetVmPincode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    validateRequiredParam(endpoint_id, 'endpoint_id')

    const result = await sendMobileAction(endpoint_id, 'prov_reset_vm_pincode')

    res.status(200).json(result)
  } catch (error: any) {
    next(error)
  }
}

const changeNetwork = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { endpoint_id, network_name } = req.body;

    // ולידציות בסיסיות
    validateRequiredParam(endpoint_id, 'endpoint_id');
    validateRequiredParam(network_name, 'network_name');

    // נירמול שם הרשת
    const normalized = network_name.toLowerCase().replace(/ /g, "_");

    // מיפוי הרשתות לפעולות API
    const networkActions = {
      pelephone_and_partner: "both_networks_pl_first_force",
      hot_and_partner: "both_networks_ht_first_force",
      pelephone: "pelephone_only_force"
    } as const;

    const action = networkActions[normalized as keyof typeof networkActions];

    // בדיקה אם הרשת קיימת
    if (!action) {
      const error: HttpError.Model = {
        status: 400,
        message: `Invalid network_name provided. Use one of: "pelephone_and_partner", "hot_and_partner", "pelephone".`
      };
      throw error;
    }

    const numericEndpointId = parseInt(endpoint_id);

    // שליחת הפעולה
    const result = await sendMobileAction(numericEndpointId, action);
    console.log('changeNetwork result:', result);

    res.status(200).json(result);
  } catch (error) {    
    next(error);
  }
};

const getPackagesWithInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const result: Widely.Model = await callingWidely(
      'get_packages_with_info',
      {
        reseller_domain_id: config.widely.accountId,
        package_types: ['base']
      }
    )
    res.status(result.error_code).json(result)
  } catch (error: any) {
    next(error)
  }
}
const changePackages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id, package_id } = req.body
    validateRequiredParam(endpoint_id, 'endpoint_id')
    validateRequiredParam(package_id, 'package_id')

    if (!package_id || isNaN(Number(package_id))) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Invalid package_id provided. It must be a number.'
      }
      throw error
    }

    const result: Widely.Model = await callingWidely(
      'prov_update_mobile_subscription',
      {
        endpoint_id: endpoint_id,
        service_id: package_id
      }
    )
    validateWidelyResult(result, 'Failed to change package')
    res.status(result.error_code).json(result)
  } catch (error: any) {
    next(error)
  }
}
export {
  terminateMobile,
  provResetVmPincode,
  getPackagesWithInfo,
  changePackages,
  changeNetwork,
}
