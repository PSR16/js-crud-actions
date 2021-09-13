document.getElementById("delete").onclick = function () {
  const productId = document.getElementById("product-id").value;
  axios
    .delete(`/api/products/${productId}`)
    .then(processResult)
    .catch((err) => {
      if (err.response.status === 404) {
        notFound();
      }
    });

};

function processResult() {
  window.alert("Product deleted!");
}