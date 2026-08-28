import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

function Pago() {

    const [alerta,setAlerta] = useState({tipo:"", mensaje:""});
 return (
    <PayPalScriptProvider
      options={{
        "client-id": "test", // Recuerda cambiar esto por tu nuevo ID de Sandbox luego
        currency: "USD",
        intent: "capture",
      }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            
            {/* Tarjeta con sombra y bordes redondeados */}
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4 p-md-5 text-center">
                
                <h3 className="mb-3 fw-bold" style={{ color: "#0d6efd" }}>Confirmar Pago</h3>
                <p className="text-muted mb-4">Estás a un paso de asegurar el servicio técnico.</p>

                {/* Resumen del cobro */}
                <div className="bg-light p-3 rounded-3 mb-4 border">
                  <h5 className="mb-0 text-dark">
                    Total a pagar: <strong>$10.00 USD</strong>
                  </h5>
                </div>

                {/* Renderizado condicional de la alerta de Bootstrap */}
                {alerta.mensaje && (
                  <div 
                    className={`alert alert-${alerta.tipo} alert-dismissible fade show text-start`} 
                    role="alert"
                  >
                    {alerta.mensaje}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setAlerta({ tipo: "", mensaje: "" })}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                {/* Botones de PayPal con algo de estilo extra */}
                <div className="mt-2">
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "rect", color: "blue" }}
                    createOrder={(data, actions) => {
                  
                      setAlerta({ tipo: "", mensaje: "" }); 
                      
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: "10.00",
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        // Cambiamos el alert() por el estado de éxito
                        setAlerta({
                          tipo: "success",
                          mensaje: `¡Pago exitoso! Gracias por confiar en nosotros, ${details.payer.name.given_name}.`,
                        });
                      });
                    }}
                    onError={(err) => {
                      console.log("Error PayPal:", err);
                  
                      setAlerta({
                        tipo: "danger",
                        mensaje: "Hubo un problema al procesar el pago. Por favor, intenta nuevamente.",
                      });
                    }}
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}

export default Pago;