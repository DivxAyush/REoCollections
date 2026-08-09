// ============================================================
// ADMIN-ONLY MIDDLEWARE
// Must be used AFTER protect middleware
// ============================================================
export function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    })
  }
  next()
}
