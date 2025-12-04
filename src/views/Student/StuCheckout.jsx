import { useState, useEffect } from "react";
import { Lock, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { lazy, Suspense } from "react";
import OrderSummary from "../Student/CourseCard/OrderSummary";
import useStudent from "@/hooks/useStudent";

const Footer = lazy(() => import("../../components/Footer/Footer"));

function StuCheckout() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart } = useStudent();
  
  const totalCourses = cart.data?.length || 0;
  const originalPrice = cart.data?.reduce((sum, c) => sum + (c.price || 0), 0) || 0;
  const discount = 0;
  const tax = originalPrice * 0.1; // 10% tax
  const total = originalPrice - discount + tax;

  // 🧾 Billing Address State
  const [address, setAddress] = useState({
    firstName: "Joginder",
    lastName: "Singh",
    academyName: "Gambolthemes",
    country: "India",
    address1: "#1234 Street No. 45, Ward No. 60, Phase 3",
    address2: "Shahid Karnail Singh Nagar, Near Pakhowal Road",
    city: "Ludhiana",
    state: "Punjab",
    postal: "141013",
    phone: "+91123456789",
  });

  // 💳 Card Details
  const [cardDetails, setCardDetails] = useState({
    holderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  });

  // 🏦 Bank Details
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    iban: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("studentAddress");
    if (saved) setAddress(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("studentAddress", JSON.stringify(address));
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (paymentMethod === "card") {
        const { holderName, cardNumber, expiryMonth, expiryYear, cvc } = cardDetails;

        if (!holderName || !cardNumber || !expiryMonth || !expiryYear || !cvc) {
          alert("⚠️ Please fill in all card details.");
          return;
        }

        if (!/^\d{16}$/.test(cardNumber)) {
          alert("⚠️ Card number must be 16 digits.");
          return;
        }

        if (!/^\d{3,4}$/.test(cvc)) {
          alert("⚠️ CVC must be 3 or 4 digits.");
          return;
        }

        console.log("💳 Card Details:", cardDetails);
      }

      if (paymentMethod === "bank") {
        const { bankName, accountNumber, iban } = bankDetails;

        if (!bankName || !accountNumber || !iban) {
          alert("⚠️ Please fill in all bank details.");
          return;
        }

        console.log("🏦 Bank Details:", bankDetails);
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - navigate to success page
      navigate("/StudentLayout/StuCheckoutSuccess");
      
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  return (
    <div className="min-h-screen bg-background text-text-primary animate-fade-in-up mt-16">
      {/* Header */}
      <div className="bg-surface border-b border-border shadow-sm">
        <div className="custom-container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-2">
            <button 
              onClick={() => navigate("/StudentLayout/StuShoppingCart")}
              className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors btn-hover p-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </button>
            <div className="text-text-secondary text-sm bg-surface px-3 py-1 rounded-full border border-border">
              Secure Checkout
            </div>
          </div>
          
          <div className="flex items-center gap-3 py-4 border-t border-border">
            <div className="flex items-center gap-2 text-primary">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span className="font-semibold">Cart</span>
            </div>
            <div className="w-8 h-0.5 bg-primary"></div>
            <div className="flex items-center gap-2 text-primary">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="font-semibold">Checkout</span>
            </div>
            <div className="w-8 h-0.5 bg-border"></div>
            <div className="flex items-center gap-2 text-text-secondary">
              <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span>Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="custom-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-8 space-y-6">
            {/* Billing Address Card */}
            <div className="card border border-border rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Billing Details
                  </h2>
                  <p className="text-text-secondary text-sm mt-1">
                    Your courses will be registered under this address
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer text-text-primary bg-surface border border-border hover:bg-accent transition-colors btn-hover"
                >
                  {!showForm ? "Edit" : "Cancel"}
                </button>
              </div>

              {/* Billing Info / Form */}
              {!showForm ? (
                <div className="text-text-secondary space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Name</span>
                      <p className="font-medium text-text-primary">
                        {address.firstName} {address.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <p className="font-medium text-text-primary">{address.phone}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Address</span>
                    <p className="font-medium text-text-primary">{address.address1}</p>
                    <p className="font-medium text-text-primary">{address.address2}</p>
                    <p className="font-medium text-text-primary">
                      {address.city}, {address.state}, {address.postal}
                    </p>
                    <p className="font-medium text-text-primary">{address.country}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["firstName", "First Name"],
                    ["lastName", "Last Name"],
                    ["academyName", "Academy Name"],
                    ["country", "Country"],
                    ["address1", "Address Line 1"],
                    ["address2", "Address Line 2"],
                    ["city", "City"],
                    ["state", "State / Province"],
                    ["postal", "Postal Code"],
                    ["phone", "Phone Number"],
                  ].map(([key, label]) => (
                    <div
                      key={key}
                      className={
                        [
                          "academyName",
                          "country",
                          "address1",
                          "address2",
                        ].includes(key)
                          ? "col-span-2"
                          : ""
                      }
                    >
                      <label className="block text-sm font-medium mb-2 text-text-primary">
                        {label}
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={address[key]}
                        onChange={handleChange}
                        className="w-full border border-input rounded-lg px-4 py-3 bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>
                  ))}
                  <div className="col-span-2 flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 border border-border text-text-primary rounded-lg hover:bg-accent transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn btn-primary px-6 py-3 rounded-lg btn-hover"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Card */}
            <div className="card border border-border rounded-xl shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Payment Method
                </h2>
                <p className="text-text-secondary text-sm mt-1">
                  Choose your preferred payment method
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Payment Method Tabs */}
                <div className="flex border border-border rounded-lg bg-surface mb-6 overflow-hidden">
                  {[
                    { id: "card", label: "Credit/Debit Card" },
                    { id: "bank", label: "Bank Transfer" },
                    { id: "paypal", label: "PayPal" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex-1 py-4 px-6 text-center transition-colors ${
                        paymentMethod === method.id
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-text-secondary hover:bg-accent"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>

                {/* Card Payment Form */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-text-primary">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardDetails.holderName}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            holderName: e.target.value,
                          })
                        }
                        placeholder="Enter full name as on card"
                        className="w-full border border-input rounded-lg px-4 py-3 bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-text-primary">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={formatCardNumber(cardDetails.cardNumber)}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardNumber: e.target.value.replace(/\s/g, ''),
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full border border-input rounded-lg px-4 py-3 bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-text-primary">
                          Expiry Month
                        </label>
                        <select
                          value={cardDetails.expiryMonth}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              expiryMonth: e.target.value,
                            })
                          }
                          className="w-full border border-input rounded-lg px-4 py-3 bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-text-primary">
                          Expiry Year
                        </label>
                        <input
                          type="text"
                          value={cardDetails.expiryYear}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              expiryYear: e.target.value,
                            })
                          }
                          placeholder="YYYY"
                          maxLength={4}
                          className="w-full border border-input rounded-lg px-4 py-3 bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-text-primary">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cvc}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, cvc: e.target.value })
                          }
                          placeholder="123"
                          maxLength={4}
                          className="w-full border border-input rounded-lg px-4 py-3 bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Form */}
                {paymentMethod === "bank" && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-text-primary">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={bankDetails.bankName}
                        onChange={(e) =>
                          setBankDetails({
                            ...bankDetails,
                            bankName: e.target.value,
                          })
                        }
                        placeholder="Enter bank name"
                        className="w-full border border-input rounded-lg px-4 py-3 bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-text-primary">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={bankDetails.accountNumber}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              accountNumber: e.target.value,
                            })
                          }
                          placeholder="Enter account number"
                          className="w-full border border-input rounded-lg px-4 py-3 bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-text-primary">
                          IBAN
                        </label>
                        <input
                          type="text"
                          value={bankDetails.iban}
                          onChange={(e) =>
                            setBankDetails({ ...bankDetails, iban: e.target.value })
                          }
                          placeholder="Enter IBAN"
                          className="w-full border border-input rounded-lg px-4 py-3 bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Section */}
                {paymentMethod === "paypal" && (
                  <div className="mb-6 p-6 bg-surface border border-border rounded-lg">
                    <div className="text-center mb-4">
                      <p className="text-text-secondary mb-4">
                        You will be redirected to PayPal's secure checkout to complete your payment.
                      </p>
                      <div className="flex justify-center gap-4 mb-4">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                          alt="Visa"
                          className="h-8 object-contain"
                        />
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                          alt="MasterCard"
                          className="h-8 object-contain"
                        />
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/a/a4/PayPal_2014_logo.png"
                          alt="PayPal"
                          className="h-8 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-lg mb-6">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm text-text-secondary">
                    Your payment information is secure and encrypted
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full btn btn-primary py-4 rounded-lg text-lg font-semibold btn-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Complete Purchase - ${total.toFixed(2)}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <Suspense fallback={
                <div className="card border border-border rounded-xl p-6 bg-surface shadow-sm animate-pulse">
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded w-1/2"></div>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-4 bg-muted rounded"></div>
                    ))}
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </div>
              }>
                <OrderSummary
                  totalCourses={totalCourses}
                  originalPrice={originalPrice}
                  discount={discount}
                  couponApplied={false}
                  onApplyCoupon={() => {}}
                  onCheckout={() => {}}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Suspense fallback={<div className="h-20 bg-surface mt-12"></div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default StuCheckout;