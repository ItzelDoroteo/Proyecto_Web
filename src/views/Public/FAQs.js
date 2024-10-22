import React from "react";
import PageTitle from "../../components/Public/PageTitle";

const FAQs = () => {
  return (
    <div className="section row3 mt-4">
      <PageTitle title="Chucherias & Regalos | Preguntas Frecuentes" />

      <div className="section m-5">
        <div className="row">
          <div className="col-md-12">
            <h2 className="title-pag fw-bold text-center">
              Preguntas Frecuentes
            </h2>
            <hr className="hr-primary" />
            <div className="content faqs">
              <h3>¿Cuánto tarda en llegar mi pedido?</h3>
              <p>
                El tiempo de entrega varía según tu ubicación y el método de
                envío seleccionado. Por lo general, los pedidos se despachan
                dentro de 2-5 días hábiles.
              </p>
              <h3>¿Cuáles son los métodos de pago aceptados?</h3>
              <p>
                Aceptamos pagos con tarjetas de crédito y transferencias
                bancarias.
              </p>
              <h3>¿Puedo cambiar un producto?</h3>
              <p>
                Aceptamos cambios dentro de los 15 días posteriores a la
                entrega. Los artículos deben estar sin usar, en su empaque
                original y con todos los accesorios.
              </p>
              <h3>¿Ofrecen descuentos?</h3>
              <p>
                Sí, ofrecemos descuentos especiales durante fechas
                significativas, como lo son días del niño, día del amor y la
                amistad, Navidad, entre otras.
              </p>
              <h3>¿Puedo cancelar mi pedido?</h3>
              <p>
                Puedes cancelar tu pedido siempre y cuando aún no haya sido
                procesado para envío.
              </p>
              <h3>¿Qué sucede si realizo muchas compras y no las concreto?</h3>
              <p>
                Entendemos que, en ocasiones, los clientes pueden agregar
                productos al carrito de compras sin la intención de concretar
                la compra de inmediato. Sin embargo, si notamos un patrón de
                este comportamiento y no se concreta ninguna compra, nos
                reservamos el derecho de suspender temporalmente tu cuenta para
                evitar abusos.
              </p>
              {/* Nuevas preguntas frecuentes basadas en los términos y condiciones */}
              <h3>¿Cuál es el período de garantía para los productos de Chucherias & Regalos?</h3>
              <p>Ofrecemos una garantía de devolución de dinero de 30 días en todos nuestros productos.</p>
              <h3>¿Cómo puedo solicitar un reembolso si no estoy satisfecho con mi compra?</h3>
              <p>Para iniciar el proceso de devolución y obtener un reembolso, comunícate con nuestro servicio de atención al cliente.</p>
              <h3>¿Cuánto tiempo tarda en procesarse un reembolso después de devolver un producto?</h3>
              <p>Procesaremos tu reembolso dentro de los próximos 5 días hábiles después de recibir y aprobar el producto devuelto.</p>
              <h3>¿Puedo cancelar mi pedido después de realizar la compra?</h3>
              <p>Sí, puedes cancelar tu pedido dentro de las 24 horas posteriores a su realización.</p>
              <h3>¿Cuál es la edad mínima para realizar una compra en Chucherias & Regalos?</h3>
              <p>Debes tener al menos 18 años de edad para realizar una compra.</p>
              <h3>¿Qué métodos de pago se aceptan en Chucherias & Regalos?</h3>
              <p>Aceptamos pagos con tarjetas de crédito y débito, así como pagos directos en nuestra sucursal física.</p>
              <h3>¿Cuál es el alcance de envío de Chucherias & Regalos?</h3>
              <p>Actualmente, solo realizamos envíos dentro del municipio de Huejutla de Reyes, Hidalgo, México.</p>
              <h3>¿Qué debo hacer si tengo alguna pregunta o inquietud sobre mi compra después de recibirla?</h3>
              <p>Si tienes alguna pregunta o inquietud, contáctanos a través de nuestro correo electrónico de atención al cliente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;