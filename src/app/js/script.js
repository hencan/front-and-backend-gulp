console.log("Script carregado");

var data_json = [];
var search_temp = "";
const url_to_json = "assets/dados.json";
var i = 0;

document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    console.log("Prevenção de evento padrão");
    event.preventDefault();
    console.log("Pesquisando...");
    getData(requestNumber.value);
  });

function getData(valor) {
  clearForm();
  // Verificação do suporte a solicitação do fetch
  if (self.fetch) {
    console.log("O recusro Fetch funciona...");
    console.log("Valor inserido: " + valor);
    fetch(url_to_json)
      .then(function (response) {
        response.json().then(function (data) {
          data_json = data.encomendas;
          console.log(data_json);
          search(valor);
        });
      })
      .catch(function (err) {
        console.error("Json não encontrado, url: ", err);
      });
  } else {
    // Fetch não suportado, utilizando o recurso do XMLHttpRequest
    console.log("Fetch não é suportado");
    console.log("Valor inserido: " + valor);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        data_json = JSON.parse(this.responseText).encomendas;
        console.log(data_json);
        search(valor);
      }
    };
    xmlhttp.open("GET", url_to_json, true);
    xmlhttp.send();
  }
}

function search(valor) {
  for (i = 0; i < data_json.length; i++) {
    if (valor == data_json[i].id) {
      search_temp = data_json[i];
      console.log(data_json[i]);
      valueFound();
      return;
    }
  }
  if (search_temp.length == 0) {
    console.log("O número não foi encontrado");
    document.getElementById("msgError").style.display = "block";
  }
}

function valueFound() {
  document.getElementById("msgSuccess").style.display = "block";
  document.getElementById("customerName").innerHTML =
    search_temp.numero + " - " + search_temp.cliente.nome;
  document.getElementById("amount").innerHTML =
    "R$ " + new Number(search_temp.valor).toLocaleString("pt-BR");
  document.getElementById("date").innerHTML = new Date(
    search_temp.data
  ).toLocaleDateString("pt-BR");
  if (search_temp.entregue == true) {
    document.getElementById("status").innerHTML = "Entregue";
  } else {
    document.getElementById("status").innerHTML = "Entregar";
  }
}

function clearForm() {
  search_temp = "";
  document.getElementById("msgSuccess").style.display = "none";
  document.getElementById("msgError").style.display = "none";
}
