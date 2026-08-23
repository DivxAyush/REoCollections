import User from '../models/User.js'

// @desc    Get all staff (admin, super_admin, helper)
// @route   GET /api/admin/staff
// @access  Private/SuperAdmin
export const getStaff = async (req, res, next) => {
  try {
    const staff = await User.find({
      role: { $in: ['admin', 'super_admin', 'helper'] },
    }).select('-password')

    res.status(200).json({
      success: true,
      data: staff,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new staff member
// @route   POST /api/admin/staff
// @access  Private/SuperAdmin
export const createStaff = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    if (!['admin', 'super_admin', 'helper'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role provided',
      })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use',
      })
    }

    const staff = await User.create({
      name,
      email,
      password,
      role,
      isActive: true,
    })

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: {
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update staff role or active status
// @route   PATCH /api/admin/staff/:id/role
// @access  Private/SuperAdmin
export const updateStaffRole = async (req, res, next) => {
  try {
    const { role } = req.body

    if (role && !['admin', 'super_admin', 'helper', 'customer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role provided',
      })
    }

    const staff = await User.findById(req.params.id)

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      })
    }
    
    // Prevent super_admin from demoting themselves by accident, optional but good practice.
    if (req.user._id.toString() === staff._id.toString() && role !== 'super_admin') {
       return res.status(400).json({
         success: false,
         message: 'You cannot change your own super_admin role',
       })
    }

    if (role) staff.role = role

    await staff.save()

    res.status(200).json({
      success: true,
      message: 'Staff updated successfully',
      data: staff,
    })
  } catch (error) {
    next(error)
  }
}
