import React, { useState } from 'react';
import { useCart } from '../src/shared/context/CartContext';
import Navbar from '../src/shared/components/Navbar';
import { ProductEntity } from '../src/features/products/domain/entities/ProductEntity';
import { ChevronDown, MapPin, Truck, HelpCircle, CreditCard } from 'lucide-react';

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- Sub-components for styling ---
const InputField = ({ id, label, optional = false, fullWidth = false, ...props }) => (
  <div className={fullWidth ? 'col-span-2' : ''}>
    <label htmlFor={id} className="sr-only">{label}</label>
    <input 
        id={id} 
        name={id} 
        placeholder={label + (optional ? ' (opcional)' : '')} 
        className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
        {...props}
    />
  </div>
);

const SelectField = ({ id, label, options, fullWidth = false }) => (
    <div className={`relative ${fullWidth ? 'col-span-2' : ''}`}>
        <label htmlFor={id} className="sr-only">{label}</label>
        <select 
            id={id} 
            name={id} 
            className="w-full appearance-none bg-white px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
    </div>
);

const RadioSelect = ({ value, label, sublabel, selected, onChange, icon }) => (
    <div onClick={() => onChange(value)} className={`flex justify-between items-center p-4 border rounded-md cursor-pointer transition-all ${selected ? 'border-blue-600 ring-2 ring-blue-500' : 'border-stone-300'}`}>
        <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected ? 'border-blue-600 bg-blue-600' : 'border-stone-400'}`}>
                {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <span className="ml-4 font-medium text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {icon}
            {sublabel && <span className="font-semibold text-sm">{sublabel}</span>}
        </div>
    </div>
);

const CheckoutPage = () => {
    const { cartItems, getCartTotal } = useCart();
    const [deliveryMethod, setDeliveryMethod] = useState('envio');
    const [paymentMethod, setPaymentMethod] = useState('bold');
    const [billingAddress, setBillingAddress] = useState('same');

    const shippingCost = 18000;
    const total = getCartTotal() + shippingCost;

    return (
        <div className="bg-white min-h-screen font-sans">
            <Navbar />
            <div className="lg:grid lg:grid-cols-2">
                {/* Left side: Form (scrollable) */}
                <div className="lg:border-r lg:h-screen lg:overflow-y-auto">
                    <div className="py-12 px-4 sm:px-6 lg:px-12 xl:px-20 max-w-2xl mx-auto">
                        <h1 className="font-serif text-3xl font-medium mb-8 text-center">AV-STORE</h1>
                        <form className="space-y-8">
                            {/* Form sections */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Contacto</h2>
                                    <a href="#" className="text-sm text-blue-600 hover:underline">Iniciar sesión</a>
                                </div>
                                <InputField id="email" label="Email o número de teléfono móvil" fullWidth type="email" />
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4">Entrega</h2>
                                <div className="flex gap-2 mb-4">
                                    <button type="button" onClick={() => setDeliveryMethod('envio')} className={`flex-grow flex justify-center items-center gap-2 p-4 border rounded-md text-sm font-medium transition-all ${deliveryMethod === 'envio' ? 'border-blue-600 ring-2 ring-blue-500 bg-blue-50' : 'border-stone-300'}`}><Truck size={18}/>Envío</button>
                                    <button type="button" onClick={() => setDeliveryMethod('retiro')} className={`flex-grow flex justify-center items-center gap-2 p-4 border rounded-md text-sm font-medium transition-all ${deliveryMethod === 'retiro' ? 'border-blue-600 ring-2 ring-blue-500 bg-blue-50' : 'border-stone-300'}`}><MapPin size={18}/>Retiro</button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <SelectField id="country" label="País/Región" options={[{value: 'co', label: 'Colombia'}]} fullWidth />
                                    <InputField id="firstName" label="Nombre" />
                                    <InputField id="lastName" label="Apellidos" />
                                    <InputField id="cedula" label="Cédula" fullWidth />
                                    <InputField id="address" label="Dirección" fullWidth />
                                    <InputField id="apartment" label="Casa, apartamento, etc." optional fullWidth />
                                    <InputField id="city" label="Ciudad" />
                                    <SelectField id="state" label="Provincia / Estado" options={[{value: 'meta', label: 'Meta'}]} />
                                    <InputField id="postalCode" label="Código postal" optional />
                                    <div className="col-span-2 relative">
                                        <InputField id="phone" label="Teléfono" type="tel" fullWidth />
                                        <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"/>
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                        <input id="save-info" type="checkbox" className="h-4 w-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="save-info" className="ml-2 block text-sm text-stone-800">Guardar mi información y consultar más rápidamente la próxima vez</label>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4">Métodos de envío</h2>
                                <RadioSelect value="nacional" label="Envío Nacional" sublabel={formatCurrency(shippingCost)} selected={true} onChange={() => {}} />
                            </section>
                            
                            <section>
                                <h2 className="text-xl font-semibold mb-4">Pago</h2>
                                <p className="text-sm text-stone-500 mb-4">Todas las transacciones son seguras y están encriptadas.</p>
                                <div className="space-y-3">
                                    <RadioSelect value="bold" label="Bold" icon={<CreditCard size={20}/>} selected={paymentMethod === 'bold'} onChange={setPaymentMethod} />
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4">Dirección de facturación</h2>
                                <div className="space-y-3">
                                    <RadioSelect value="same" label="La misma dirección de envío" selected={billingAddress === 'same'} onChange={setBillingAddress} />
                                    <RadioSelect value="different" label="Usar una dirección de facturación distinta" selected={billingAddress === 'different'} onChange={setBillingAddress} />
                                </div>
                            </section>

                            <div className="mt-10 pt-6 border-t">
                                <button type="submit" className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors">Pagar ahora</button>
                            </div>

                            <div className="mt-8 text-xs text-stone-500 space-x-4 text-center">
                                <a href="#" className="hover:underline">Política de reembolso</a>
                                <a href="#" className="hover:underline">Política de privacidad</a>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right side: Order Summary (sticky) */}
                <div className="hidden lg:block bg-stone-50">
                    <div className="py-12 px-4 sm:px-6 lg:px-12 xl:px-20 sticky top-0">
                        <div className="max-w-lg mx-auto lg:mx-0">
                            <h2 className="text-xl font-semibold mb-6">Resumen del pedido</h2>
                            <div className="space-y-5">
                                {cartItems.length > 0 ? (
                                    cartItems.map(item => {
                                        const product = new ProductEntity(item);
                                        return (
                                            <div key={item.variantId} className="flex items-center gap-4">
                                                <div className="relative w-20 h-20 rounded-lg bg-stone-200 border">
                                                    <img src={product.primaryImage || 'https://via.placeholder.com/64'} alt={product.name} className="w-full h-full object-cover rounded-md" />
                                                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-stone-600 rounded-full">{item.quantity}</span>
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-semibold text-sm">{product.name}</h3>
                                                    <p className="text-sm text-stone-500">{item.size} / {item.color}</p>
                                                </div>
                                                <p className="font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <p>No hay productos en el carrito.</p>
                                )}
                            </div>
                            <div className="border-t border-stone-200 mt-8 pt-6 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium">{formatCurrency(getCartTotal())}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Envío</span>
                                    <span className="font-medium">{formatCurrency(shippingCost)}</span>
                                </div>
                            </div>
                            <div className="border-t border-stone-200 mt-6 pt-6">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
