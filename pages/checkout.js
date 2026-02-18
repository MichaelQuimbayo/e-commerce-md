
import React, { useContext, useState, useRef } from 'react';
import { useCart } from '../src/shared/context/CartContext';
import Navbar from '../src/shared/components/Navbar';
import Footer from '../src/shared/components/Footer';
import { useRouter } from 'next/router';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const router = useRouter();
    const fileInputRef = useRef(null);

    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        address: '',
        city: '',
        zip: '',
        phone: '',
        email: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'transfer', 'qr', 'cod'
    const [receipt, setReceipt] = useState(null);

    const handleShippingInfoChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        setReceipt(null); // Reset receipt on payment method change
    };

    const handleReceiptChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setReceipt(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(Object.values(shippingInfo).some(field => field === '')) {
            alert('Por favor, complete toda la información de envío.');
            return;
        }

        if ((paymentMethod === 'transfer' || paymentMethod === 'qr') && !receipt) {
            alert('Por favor, adjunte el comprobante de pago.');
            return;
        }

        const orderDetails = {
            shippingInfo,
            paymentMethod,
            items: cartItems,
            total: getCartTotal(),
            receipt: receipt ? receipt.name : null
        };

        // Simulate API call and form data submission
        console.log('Enviando pedido:', orderDetails);
        alert('¡Pedido realizado con éxito! (Simulación)');

        clearCart();
        router.push('/');
    };

    return (
        <div className="bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Shipping Information */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Información de Envío</h2>
                        <div className="space-y-4">
                            {Object.keys(shippingInfo).map(key => (
                                <div key={key}>
                                    <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                    <input 
                                        type={key === 'email' ? 'email' : 'text'} 
                                        id={key} 
                                        name={key} 
                                        value={shippingInfo[key]}
                                        onChange={handleShippingInfoChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary and Payment */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Resumen del Pedido</h2>
                        <div className="space-y-4">
                            {cartItems.length > 0 ? (
                                cartItems.map(item => (
                                    <div key={item.id} className="flex items-center">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                            {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                                            {item.size && <p className="text-sm text-gray-500">Talla: {item.size}</p>}
                                        </div>
                                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No hay productos en el carrito.</p>
                            )}
                        </div>
                        <div className="border-t border-gray-200 mt-4 pt-4">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${getCartTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">Método de Pago</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input id="transfer" name="paymentMethod" value="transfer" type="radio" onChange={handlePaymentMethodChange} checked={paymentMethod === 'transfer'} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                                <label htmlFor="transfer" className="ml-3 block text-sm font-medium text-gray-700">Transferencia Bancaria</label>
                            </div>
                            <div className="flex items-center">
                                <input id="qr" name="paymentMethod" value="qr" type="radio" onChange={handlePaymentMethodChange} checked={paymentMethod === 'qr'} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                                <label htmlFor="qr" className="ml-3 block text-sm font-medium text-gray-700">Escaneo QR</label>
                            </div>
                             <div className="flex items-center">
                                <input id="cod" name="paymentMethod" value="cod" type="radio" onChange={handlePaymentMethodChange} checked={paymentMethod === 'cod'} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                                <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">Contra Entrega</label>
                            </div>
                        </div>
                        
                        {/* Payment method details */}
                        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            {paymentMethod === 'transfer' && (
                                <div>
                                    <h3 className="font-semibold">Instrucciones para Transferencia Bancaria</h3>
                                    <p className="text-sm text-gray-600 mt-2">Por favor, transfiera el monto total a la siguiente cuenta y adjunte el comprobante.</p>
                                    <p className="text-sm font-mono mt-2">Banco: MiBanco, Cuenta: 123-456-789, Titular: E-Commerce MD</p>
                                </div>
                            )}
                            {paymentMethod === 'qr' && (
                                <div className="text-center">
                                    <h3 className="font-semibold">Pago con QR</h3>
                                    <div className="w-32 h-32 bg-gray-300 mx-auto mt-2 flex items-center justify-center">
                                        <p className="text-sm text-gray-500">[Aquí va el código QR]</p>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">Por favor, escanee el código y adjunte el comprobante.</p>
                                </div>
                            )}
                            {paymentMethod === 'cod' && (
                                <div>
                                    <h3 className="font-semibold">Pago Contra Entrega</h3>
                                    <p className="text-sm text-gray-600 mt-2">Usted pagará en efectivo al momento de recibir su pedido.</p>
                                </div>
                            )}
                            
                            {(paymentMethod === 'transfer' || paymentMethod === 'qr') && (
                                <div className="mt-4">
                                    <input type="file" accept="image/*,application/pdf" ref={fileInputRef} onChange={handleReceiptChange} style={{ display: 'none' }} />
                                    <button type="button" onClick={handleUploadClick} className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
                                        Adjuntar Comprobante
                                    </button>
                                    {receipt && <p className="text-sm text-gray-500 mt-2 text-center">Archivo: {receipt.name}</p>}
                                </div>
                            )}
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 text-white py-3 px-4 mt-8 border border-transparent rounded-md shadow-sm text-base font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Realizar Pedido
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
