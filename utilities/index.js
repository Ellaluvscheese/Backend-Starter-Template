const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
// Util.getNav = async function (req, res, next) {
//   let data = await invModel.getClassifications()
//   console.log(data)
//   let list = "<ul class='my-links'>"
//   list += '<li><a href="/" title="Home page">Home</a></li>'
//   data.rows.forEach((row) => {
//     list += "<li>"
//     list +=
//       '<a href="/inv/type/' +
//       row.classification_id +
//       '" title="See our inventory of ' +
//       row.classification_name +
//       ' vehicles">' +
//       row.classification_name +
//       "</a>"
//     list += "</li>"
//   })
//   list += "</ul>"
//   return list
// }
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  console.log(data);
  let list =  '<a class="hamburger-menu" onclick="toggleMenu()" href="#">&#9776;</a>';
  list += "<ul class='my-links'>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  // Adding the script for the toggleMenu function
  list +=
  '<script> function toggleMenu() { var x = document.querySelector(".my-links"); var icon = document.querySelector(".hamburger-menu"); if (x.style.display === "block") { x.style.display = "none"; icon.innerHTML = "&#9776;"; } else { x.style.display = "block"; icon.innerHTML = "&#10006;"; } } </script>';
return list;
};


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li class="car-cards">'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        // grid += '<hr />'
        grid += '<h3>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h3>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /* **************************************
* Build the specific view HTML
* ************************************ */
Util.buildSpecificVehicle = function(data){
  let card;
  if (data) {
    card = '<div id="specifics-container">'
    card += '<div id="specifics-top">'
    card += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make 
    + ' ' + data.inv_model + ' on CSE Motors" />'
    card += '</div>'
    card += '<div id="specifics-bottom">'
    card += '<h3 id="make-h3">' + data.inv_make + ': </h3>'
    card += '<ul class="description-ul">'
    card += '<li id="miles"><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</li>'
    card += '<li id="year"><strong>Year:</strong> ' + data.inv_year + '</li>'
    card += '<li id="price"><strong>Price:</strong>$' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</li>'
    card += '<li id="color"><strong>Color:</strong> ' + data.inv_color + '</li>'
    card += '<li id="class"><strong>Classification:</strong> ' + data.classification_name + '</li>'
    card += '</ul>'
    card += '</div>'
    card += '<div id="description-grid">'
    card += '<h4 id="description-h4">Description:</h4>'
    card += '<p>' + data.inv_description + '</p>'
    card += '</div>'
    card += '</div>'
  } else {
    card += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return card
}

// Util.buildClassificationFormInput = async function () {
//   try {
//       let formInput = '<select name="classification_id" required>';
//       const data = await invModel.getClassificationFormInput();
//       data.forEach(classification => {
//           formInput += `<option value="${classification.classification_id}">${classification.classification_name}</option>`;

//       });
//       formInput += '</select>';
//       console.log(formInput);
//       return Promise.resolve(formInput); // Explicitly wrap in a Promise
//   } catch (error) {
//       console.error("getClassificationFormInput error " + error);
//       return Promise.reject(error);
//   }
// };

Util.buildClassificationFormInput = async function (classification_id = null) {
  try {
      let formInput = '<select name="classification_id" required>';
      const data = await invModel.getClassificationFormInput();
      formInput += '<option value="">Select a Classification</option>';
      data.forEach(row => {
          formInput += `<option value="${row.classification_id}"`
          if (
            classification_id != null &&
            classification_id == row.classification_id
          ){
            formInput += ' selected ';
          }
          formInput += `>${row.classification_name}</option>`

      });
      formInput += '</select>';
      console.log(formInput);
      return Promise.resolve(formInput); // Explicitly wrap in a Promise
  } catch (error) {
      console.error("getClassificationFormInput error " + error);
      return Promise.reject(error);
  }
};




  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util