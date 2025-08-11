import { Router } from 'express'
import * as widelyController from '@controller/widely'
import { hasRole } from '@middleware/auth'

const widelyRouter = Router()

widelyRouter.post('/search_users', hasRole('admin'), widelyController.searchUsers)
widelyRouter.post('/get_mobiles', hasRole('admin'), widelyController.getMobiles)
widelyRouter.post('/get_mobile_info', hasRole('admin'), widelyController.getMobileInfo)
widelyRouter.post('/get_all_user_data', hasRole('admin'), widelyController.getAllUserData)
widelyRouter.post('/terminate_mobile', hasRole('admin'), widelyController.terminateMobile)
widelyRouter.post('/get_packages_with_info', hasRole('admin'), widelyController.getPackagesWithInfo)
widelyRouter.post('/prov_reset_vm_pincode', hasRole('admin'), widelyController.provResetVmPincode)
widelyRouter.post('/send_apn', hasRole('admin'), widelyController.sendApn)
widelyRouter.post('/update_mobile_subscription', hasRole('admin'), widelyController.changePackages)
widelyRouter.post('/reset_device', hasRole('admin'), widelyController.ComprehensiveResetDeviceController)
widelyRouter.post('/add_one_time_package', hasRole('admin'), widelyController.addOneTimePackage)

export default widelyRouter
