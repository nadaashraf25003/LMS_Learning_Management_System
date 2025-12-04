import React, { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import useStudent from "@/hooks/useStudent";
import toast, { Toaster } from "react-hot-toast";
import ConfirmToast from "@/utils/ConfirmToast";

const CourseCard = lazy(() => import("../Student/CourseCard/CourseCard"));
const OrderSummary = lazy(() => import("../Student/CourseCard/OrderSummary"));

export default function StuShoppingCart() {
  const navigate = useNavigate();
  const { cart, removeCartItem } = useStudent();
  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = () => {
    setCouponApplied(true);
    toast.success("Coupon applied successfully!");
  };

  const handleCheckout = () => {
    if (cart.data?.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    navigate("/StudentLayout/StuCheckout");
  };

  const handleRemoveWithConfirm = (courseId) => {
    toast.custom((t) => (
      <ConfirmToast
        message="Are you sure you want to remove this course from your cart?"
        onConfirm={() => removeCartItem.mutate(courseId)}
        onCancel={() => toast.dismiss(t.id)}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in-up">
      <div className="flex flex-col gap-6 pt-24 px-24 max-xl:px-8 max-lg:px-6 max-md:px-4 max-sm:px-2">
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'bg-surface text-text-primary border border-border',
          }}
        />
        
        {/* Header Section */}
        <div className="w-full flex justify-between items-center mb-2">
          <LandingHeading header="Shopping Cart" />
          <span className="text-text-secondary text-sm bg-surface px-3 py-1 rounded-full border border-border">
            {cart.data?.length || 0} {cart.data?.length === 1 ? 'course' : 'courses'}
          </span>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-7xl mx-auto">
          {/* Courses List */}
          <div className="space-y-4 w-full lg:w-3/4">
            {cart.data && cart.data.length > 0 ? (
              <div className="card border border-border rounded-xl p-6 bg-surface shadow-sm">
                <h3 className="text-text-primary text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  </svg>
                  Your Courses
                </h3>
                <div className="space-y-4">
                  {cart.data.map((course) => (
                    <Suspense key={course.id} fallback={
                      <div className="card border border-border rounded-lg p-4 bg-surface animate-pulse">
                        <div className="flex gap-4">
                          <div className="w-24 h-16 bg-muted rounded-md"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    }>
                      <CourseCard
                        course={course}
                        onRemove={() => handleRemoveWithConfirm(course.id)}
                      />
                    </Suspense>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card border border-border rounded-xl p-12 text-center bg-surface shadow-sm">
                <div className="flex flex-col items-center gap-4">
                  <svg className="w-16 h-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <h3 className="text-text-primary text-xl font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-text-secondary mb-6">Start adding some courses to your cart!</p>
                    <button 
                      onClick={() => navigate("/SearchResults")}
                      className="btn btn-primary btn-hover px-6 py-3 rounded-lg"
                    >
                      Browse Courses
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/4 sticky top-28">
            <Suspense fallback={
              <div className="card border border-border rounded-xl p-6 bg-surface shadow-sm animate-pulse">
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </div>
            }>
              <OrderSummary
                totalCourses={cart.data?.length || 0}
                originalPrice={cart.data?.reduce((sum, c) => sum + (c.price || 0), 0) || 0}
                discount={couponApplied ? 5 : 0}
                couponApplied={couponApplied}
                onApplyCoupon={handleApplyCoupon}
                onCheckout={handleCheckout}
              />
            </Suspense>

            {/* Continue Shopping */}
            {cart.data && cart.data.length > 0 && (
              <button 
                onClick={() => navigate("/SearchResults")}
                className="w-full mt-4 py-3 px-4 border border-border text-text-primary bg-surface hover:bg-accent rounded-lg transition-all duration-300 font-medium btn-hover"
              >
                Continue Shopping
              </button>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        {cart.data && cart.data.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-3 text-text-secondary">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm">30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm">Lifetime access</span>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm">Certificate of completion</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}