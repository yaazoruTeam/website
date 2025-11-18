import { Router } from 'express'
import * as widelyController from '@controller/widely'
import { hasRole } from '@middleware/auth'

const widelyRouter = Router()

widelyRouter.post('/search_users', hasRole('admin'), widelyController.searchUsers)
widelyRouter.post('/get_mobiles', hasRole('admin'), widelyController.getMobiles)
widelyRouter.post('/get_mobile_info', hasRole('admin'), widelyController.getMobileInfo)
widelyRouter.post('/get_all_user_data', hasRole('admin'), widelyController.getAllUserData)
widelyRouter.post('/get_all_user_data_public', widelyController.getAllUserData)
widelyRouter.post('/terminate_mobile', hasRole('admin'), widelyController.terminateMobile)
widelyRouter.post('/get_packages_with_info', hasRole('admin'), widelyController.getPackagesWithInfo)
widelyRouter.post('/prov_reset_vm_pincode', hasRole('admin'), widelyController.provResetVmPincode)
widelyRouter.post('/send_apn', hasRole('admin'), widelyController.sendApn)
widelyRouter.post('/update_mobile_subscription', hasRole('admin'), widelyController.changePackages)
widelyRouter.post('/reset_device', widelyController.reprovisionDeviceController)
widelyRouter.post('/changeNetwork', hasRole('admin'), widelyController.changeNetwork)
widelyRouter.post('/add_one_time_package', hasRole('admin'), widelyController.addOneTimePackage)
widelyRouter.post('/freeze_unfreeze_mobile', hasRole('admin'), widelyController.freezeUnFreezeMobile)
widelyRouter.post('/prov_create_did', hasRole('admin'), widelyController.provCreateDid)
widelyRouter.post('/lock_unlock_imei', hasRole('admin'), widelyController.updateImeiLockStatus)
widelyRouter.post('/reregister_in_hlr', hasRole('admin'), widelyController.reregisterInHlr)
widelyRouter.post('/cancel_all_locations', hasRole('admin'), widelyController.cancelAllLocations)
widelyRouter.post('/get_available_numbers', hasRole('admin'), widelyController.getAvailableNumbers)

export default widelyRouter
