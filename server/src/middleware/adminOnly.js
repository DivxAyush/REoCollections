// ============================================================
// ROLE-BASED ACCESS CONTROL MIDDLEWARES
// Must be used AFTER protect middleware
// ============================================================

export function superAdminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super Admin privileges required.',
    })
  }
  next()
}

export function adminOnly(req, res, next) {
  if (!req.user || !['admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    })
  }
  next()
}

export function staffOnly(req, res, next) {
  if (!req.user || !['admin', 'super_admin', 'helper'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Staff privileges required.',
    })
  }
  next()
}
