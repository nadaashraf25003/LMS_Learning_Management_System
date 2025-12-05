const OrderSummary = ({
  originalPrice = 0,
  discount = 0,
  couponApplied = false,
  onApplyCoupon,
  onCheckout,
  totalCourses = 0,
  showActions = true, // new prop to toggle coupon & checkout
}) => {
  const total = originalPrice - discount;

  return (
    <div className="max-w-sm w-full card shadow-md rounded-md p-10 border">
      {/* Header */}
      <h2 className="text-xl font-semibold text-text-primary mb-4 relative">
        Total
        <span className="absolute -bottom-1 left-0 w-10 h-[2px] bg-secondary"></span>
      </h2>

      {/* Total Courses */}
      <div className="flex justify-between items-center py-2">
        <span className="font-semibold text-text-primary">Total Courses</span>
        <span className="text-text-secondary font-semibold">{totalCourses}</span>
      </div>

      {/* Original Price */}
      <div className="flex justify-between items-center py-2">
        <span className="font-semibold text-text-primary">Original Price</span>
        <span className="text-text-secondary font-semibold">
          ${originalPrice}
        </span>
      </div>

      <hr className="my-3" />

      {/* Discount */}
      <div className="flex justify-between items-center py-2">
        <span className="font-semibold text-text-secondary">
          Discount Price
        </span>
        <span className="text-text-secondary font-semibold">${discount}</span>
      </div>

      <hr className="my-3" />

      {/* Total */}
      <div className="flex justify-between items-center py-3">
        <span className="font-semibold text-lg text-text-primary">Total</span>
        <span className="font-bold text-xl text-text-secondary">${total}</span>
      </div>

      <hr className="mb-3" />

      {/* Only show coupon & checkout if showActions is true */}
      {showActions && (
        <>
          {couponApplied && (
            <p className="text-sm text-text-secondary mb-3">Coupon is applied.</p>
          )}

          {!couponApplied && (
            <div className="flex mb-6">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 outline-none text-sm"
              />
              <button
                className="bg-secondary text-white px-4 rounded-r-md text-sm"
                onClick={onApplyCoupon}
              >
                Apply
              </button>
            </div>
          )}

          {/* Checkout Button */}
          <button className="w-full btn-secondary btn-hover" onClick={onCheckout}>
            Checkout Now
          </button>
        </>
      )}
    </div>
  );
};

export default OrderSummary;
