import Razorpay from 'razorpay'
import env from './env.js'

let razorpayInstance = null

if (env.razorpayKeyId && env.razorpayKeySecret && env.razorpayKeyId !== 'rzp_test_change_me') {
  razorpayInstance = new Razorpay({
    key_id: env.razorpayKeyId,
    key_secret: env.razorpayKeySecret,
  })
}

export default razorpayInstance
