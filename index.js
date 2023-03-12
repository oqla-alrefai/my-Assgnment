localStorage.setItem("searches", []);
$(document).ready(() => {
  let search = "";
  
  let data = localStorage.getItem("searches");
  $("#searchForm").on("submit", (e) => {
    search = $("#searchText").val();
    searchTest(search);
    e.preventDefault();
  });
});

// get all tests name here to use it in autocomplete
let testsName = [];
let tests = [];
$.getJSON("test.json", (data) => {
  $.each(data, (key, value) => {
    tests.push(value);
    testsName.push(value.Name);
  });
});

let searches = [];
let totalPrice = 0;
function searchTest(search) {
  let output = "";
  $.each(tests, (key, value) => {
    if (value.Name === search) {
      searches.push(value);
    }
  });
  localStorage.setItem("searches", JSON.stringify(searches));
  searches.map((search, index) => {
    totalPrice += search.Price;
    output += `
     <tr key={index}>
    <td><input type="checkbox" class="items" id="item-1" name="vehicle1" value=${search.Code}></th>
    <td>${search.Code}</th>
    <td>${search.Name}</td>
    <td>${search.Price}</td>
    <td>${search.Sample}</td>
    <td>${search.Location}</td>
    <td>${search.Requirements}</td>
    <td id="removeItem"><p id="rem">${search.Code}</p><svg style="color: red" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="red" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zM288 512a38.4 38.4 0 0 0 38.4 38.4h371.2a38.4 38.4 0 0 0 0-76.8H326.4A38.4 38.4 0 0 0 288 512z"></path></svg></td>
    </tr>
    `;
  });
  $("#elements").html(output);
  $("#report").html(`<p>total price : ${totalPrice}</p>`);
}
$("#searchText").autocomplete({
  source: testsName,
});

// download report.json file
$("#download").on("click", () => DownloadJsonFile());
function DownloadJsonFile() {
  let data = localStorage.getItem("searches");
  let blob = new Blob([data]);
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "report.json";
  localStorage.removeItem("searches");
  location.reload();
  link.click();
}

// delete all tests
$("#deleteAll").on("click", () => {
  localStorage.removeItem("searches");
  location.reload();
});

// delete one test
$("#elements").on("click", "#removeItem", function () {
  let filtered = $(this).closest("td").find("p").text();
  let data = localStorage.getItem("searches");
  let newData = [];
  let count =0;
  data = JSON.parse(data);
  totalPrice = 0;
  data = data.map((item) => {
    if (item.Code !== filtered || count > 0) {
      newData.push(item);
      totalPrice += item.Price;
    }
    else{
        count++;
    }

    // update the price
    $("#report").html(`<p>total price : ${totalPrice}</p>`);
  });
  console.log(totalPrice);
  searches = newData;
  localStorage.setItem("searches", JSON.stringify(newData));
  $(this).closest("tr").remove();
});
