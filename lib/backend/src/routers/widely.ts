import { Router } from 'express'
import * as widelyController from '../controller/widely/index'
import { hasRole } from '../middleware/auth'

const widelyRouter = Router()

widelyRouter.post('/search_users', hasRole('admin'), widelyController.searchUsers)
widelyRouter.post('/get_mobiles', hasRole('admin'), widelyController.getMobiles)
widelyRouter.post('/get_mobile_info', hasRole('admin'), widelyController.getMobileInfo)
widelyRouter.post('/get_all_user_data', hasRole('admin'), widelyController.getAllUserData)
widelyRouter.post('/terminate_mobile', hasRole('admin'), widelyController.terminateMobile)
widelyRouter.post('/get_packages_with_info', hasRole('admin'), widelyController.getPackagesWithInfo)
widelyRouter.post('/prov_reset_vm_pincode', hasRole('admin'), widelyController.provResetVmPincode)
widelyRouter.post('/update_mobile_subscription', hasRole('admin'), widelyController.changePackages)
widelyRouter.post('/freeze_unfreeze_mobile', hasRole('admin'), widelyController.freezeUnFreezeMobile)
widelyRouter.post('/lock_unlock_imei', hasRole('admin'), widelyController.updateImeiLockStatus)

export default widelyRouter
