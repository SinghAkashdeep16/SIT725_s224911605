// Fetch plant data from our Express GET REST endpoint and render as Materialize cards
const addCards = (items) => {
  items.forEach(item => {
    let itemToAppend =
      '<div class="col s12 m6 l4">' +
        '<div class="card medium">' +
          '<div class="card-image waves-effect waves-block waves-light">' +
            '<img class="activator" src="' + item.image + '" onerror="this.src=\'https://via.placeholder.com/400x250?text=' + encodeURIComponent(item.name) + '\'">' +
          '</div>' +
          '<div class="card-content">' +
            '<span class="card-title activator grey-text text-darken-4">' + item.name +
              '<i class="material-icons right">more_vert</i></span>' +
            '<span class="chip chip-category">' + item.category + '</span>' +
          '</div>' +
          '<div class="card-reveal">' +
            '<span class="card-title grey-text text-darken-4">' + item.name +
              '<i class="material-icons right">close</i></span>' +
            '<p class="card-text">' + item.description + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';
    $("#card-section").append(itemToAppend);
  });
};

const loadPlants = () => {
  $.get('/api/plants')
    .done((data) => {
      addCards(data);
    })
    .fail((err) => {
      console.error('Failed to load plants:', err);
      $("#card-section").append('<p class="center-align">Could not load plant data.</p>');
    });
};

// Reads the modal form, logs the submitted data (same pattern as the prac's
// submitForm), then appends a new card to the page immediately.
const submitForm = () => {
  let formData = {};
  formData.name = $('#plant_name').val();
  formData.category = $('#plant_category').val();
  formData.description = $('#plant_description').val();
  formData.image = $('#plant_image').val() || 'https://via.placeholder.com/400x250?text=' + encodeURIComponent(formData.name || 'Plant');

  console.log('Plant Form Submitted: ', formData);

  if (!formData.name) {
    M.toast({ html: 'Plant name is required' });
    return;
  }

  addCards([formData]);

  // Reset the form fields after adding
  $('#plant_name').val('');
  $('#plant_description').val('');
  $('#plant_image').val('');
  M.updateTextFields();
};

$(document).ready(function () {
  $('.materialboxed').materialbox();
  $('.modal').modal();
  $('select').formSelect();
  $('#plantFormSubmit').click(() => {
    submitForm();
  });
  loadPlants();
});