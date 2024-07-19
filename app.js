const BACKEND_API_URL = "http://localhost:3000/items";
ID_OF_UPDATE = null;
CURRENT_FILTER = null;
document.addEventListener("DOMContentLoaded", () => {
  //---------------read------------------------
  const select_value = document.getElementById("select-task1").value; //
  CURRENT_FILTER = select_value; //show.hide,none.
  console.log("inside dom current filter = ", CURRENT_FILTER);
  fetchAndRefreshItems(CURRENT_FILTER); //show, hide or none
  //---------------read------------------------
  //------------create----------------------
  const form = document.getElementById("modal-form");
  form.addEventListener("submit", function (event) {
    if (form.checkValidity()) {
      event.preventDefault();
      const data = new FormData(form);
      const title = data.get("title-input");
      const duration = data.get("duration-input");
      const url = data.get("url-input");
      const row = {
        topic: title,
        duration: duration,
        link: url,
      };
      console.log(row);
      handleChange();
      fetch(BACKEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(row),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Update the table with the new data returned from backend
          fetchAndRefreshItems(CURRENT_FILTER);
        })
        .catch((error) => {
          console.error("Error adding item:", error);
        });
      form.reset();
      const modal = document.getElementById("exampleModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    } else {
      event.preventDefault();
      form.reportValidity();
    }
  });
  //------------create----------------------

  //------------update----------------------
  const updateForm = document.getElementById("modal-form2");
  updateForm.addEventListener("submit", function (event) {
    if (updateForm.checkValidity()) {
      event.preventDefault();
      console.log(event.target);
      const data = new FormData(updateForm);
      const title = data.get("title-input2");
      const duration = data.get("duration-input2");
      const url = data.get("url-input2");
      console.log("BEFORE EDIT DATA IS :", title, duration, url);
      console.log("ID OF ROW INSIDE UPDATE MODAL = ", ID_OF_UPDATE);
      const id = ID_OF_UPDATE;
      ID_OF_UPDATE = null;
      const row = {
        topic: title,
        duration: duration,
        link: url,
      };
      console.log("UPDATED DATA= ", row);
      fetch(`${BACKEND_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: title,
          duration: duration,
          link: url,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          fetchAndRefreshItems(CURRENT_FILTER);
        });
      handleChange();
      updateForm.reset();
      const updateCloseBtn = document.getElementById("update-close-btn");
      updateCloseBtn.addEventListener("click", (event) => {
        console.log("clicked close button");
      });
      const modal = document.getElementById("exampleModal2");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    } else {
      event.preventDefault();
      updateForm.reportValidity();
    }
  });
  //------------update----------------------
  handleChange();

  //addRowsToTable();
  //updateTableState();

  document
    .getElementById("outer-checkbox-task1")
    .addEventListener("change", function (event) {
      toggle(event.target);
    });
});
function fetchAndRefreshItems(CURRENT_FILTER) {
  if (CURRENT_FILTER === "none") {
    fetch(BACKEND_API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        addRowsToTable(data); //read from BACKEND and write to FRONTEND.
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  } else if (CURRENT_FILTER === "show") {
    fetch(`${BACKEND_API_URL}?filter=show`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        addRowsToTable(data); //read from BACKEND and write to FRONTEND.
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  } else if (CURRENT_FILTER === "hide") {
    fetch(`${BACKEND_API_URL}?filter=hide`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        addRowsToTable(data); //read from BACKEND and write to FRONTEND.
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }
}
function addRowsToTable(rows) {
  const table = document.getElementById("table-task1");
  const colHeading = `
        <tr id="column-name-task1">
            <th><input type="checkbox" id="outer-checkbox-task1" onclick="toggle(this)"></th>
            <th>Title</th>
            <th>Duration</th>
            <th>Link</th>
            <th>Actions</th>
        </tr>
    `;
  table.innerHTML = colHeading;

  for (let i = 0; i < rows.length; ++i) {
    // console.log("ID OF ROW ", i, " = ", rows[i].id);

    let newDuration = 0;
    if (rows[i].duration < 60) {
      newDuration = `${rows[i].duration} min`;
    } else if (rows[i].duration === 60) {
      newDuration = `1 hr`;
    } else {
      newDuration = `${Math.floor(rows[i].duration / 60)} hr ${
        rows[i].duration % 60
      } min`;
    }
    const row = document.createElement("tr");
    row.classList.add("row-task1");
    row.setAttribute("data-id", rows[i].id);
    row.innerHTML = `
        <td><input type="checkbox" class="checkbox-task1" value="${i}"></td>
        <td>${rows[i].topic}</td>
        <td>${newDuration}</td>
        <td><a class="link-task1" href=${rows[i].link} target="_blank">${rows[i].link}</a></td>
        <td class="actions-td"><button class="row-delete-button btn btn-danger" onclick="handleRowDelete(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
  </svg></button>
  
  <div class="text-center">
          <button  onclick="handleRowUpdateClick(this)" type="button" class="btn btn-primary row-update-button" data-bs-toggle="modal"
              data-bs-target="#exampleModal2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
  </svg></button>
      </div>
  
  </td>
        `;
    row.classList.add("task-row-task1");
    table.appendChild(row);
  }
  //new:
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"].checkbox-task1'
  );
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("change", updateMasterCheckbox);
  }
  updateMasterCheckbox();
}

function toggle(source) {
  console.log("INSIDE TOGGLE");
  let checkboxes = document.querySelectorAll(
    'input[type="checkbox"].checkbox-task1'
  );
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = source.checked;
  }

  updateMasterCheckbox();
}

function hide() {
  console.log("HIDE BUTTON HANDLER");
  const checkboxes = document.getElementsByClassName("checkbox-task1");
  console.log(checkboxes);
  //we are in show items. and we should change the status of checked items from show to hide.
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      console.log(checkboxes[i].checked, " ,i =", i);
      console.log(
        "row number:",
        checkboxes[i].parentElement.parentElement.getAttribute("data-id")
      );

      const id =
        checkboxes[i].parentElement.parentElement.getAttribute("data-id");

      fetch(`${BACKEND_API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "hide" }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    }
  }
  //   updateTableState();
}

function show() {
  console.log("SHOW BUTTON HANDLER");
  const checkboxes = document.getElementsByClassName("checkbox-task1");

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      //const index = checkboxes[i].value;
      //rows[index].hidden = false;
      console.log(checkboxes[i].checked, " ,i =", i);
      console.log(
        "row number:",
        checkboxes[i].parentElement.parentElement.getAttribute("data-id")
      );
      const id =
        checkboxes[i].parentElement.parentElement.getAttribute("data-id");
      fetch(`${BACKEND_API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "show" }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    }
  }
  //   updateTableState();
}

function handleChange() {
  const showBtn = document.getElementById("show-btn-task1");
  const hideBtn = document.getElementById("hide-btn-task1");
  const select = document.getElementById("select-task1");
  CURRENT_FILTER = select.value;
  if (select.value === "show" || select.value === "none") {
    hideBtn.classList.remove("hidden-task1");
    showBtn.classList.add("hidden-task1");
  } else if (select.value === "hide") {
    hideBtn.classList.add("hidden-task1");
    showBtn.classList.remove("hidden-task1");
  } else {
    showBtn.classList.add("hidden-task1");
    hideBtn.classList.remove("hidden-task1");
  }
  //updateTableState();
  fetchAndRefreshItems(CURRENT_FILTER);
}

function updateMasterCheckbox() {
  console.log("INSIDE updateMasterCheckbox");
  let allChecked = true;
  let anyChecked = false;
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"].checkbox-task1'
  );
  const outerCheckbox = document.getElementById("outer-checkbox-task1");

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      anyChecked = true;
    } else {
      allChecked = false;
    }
  }
  if (checkboxes.length === 1) {
    if (anyChecked === true) {
      allChecked = true;
    } else {
      allChecked = false;
    }
  }
  outerCheckbox.checked = allChecked;
}

function convertDurationToMinutes(duration) {
  //  console.log("Inside convertDurationToMinutes() with duration:", duration);
  const regex = /(?:(\d+)\s*hr\s*)?(?:(\d+)\s*min)?/;
  const matches = duration.match(regex);
  // console.log("Matches:", matches);

  let totalMinutes = 0;

  if (matches) {
    if (matches[1]) {
      const hours = parseInt(matches[1], 10);
      totalMinutes += hours * 60;
      //  console.log("Hours:", hours, "Total Minutes:", totalMinutes);
    }
    if (matches[2]) {
      const minutes = parseInt(matches[2], 10);
      totalMinutes += minutes;
      //  console.log("Minutes:", minutes, "Total Minutes:", totalMinutes);
    }
  } else {
    return null;
  }

  //console.log("Final Total Minutes:", totalMinutes);
  return totalMinutes;
}
//UPDATE:
function handleRowUpdateClick(btn) {
  console.log("inside handleRowUpdateClick()");
  const rowToUpdate = btn.parentElement.parentElement.parentElement; //tr
  const tds = rowToUpdate.querySelectorAll("td"); //array of td's inside tr
  const title = tds[1].innerText;
  const durationStr = tds[2].innerText;
  const link = tds[3].querySelector("a").href;
  const id = rowToUpdate.getAttribute("data-id");
  ID_OF_UPDATE = id;
  console.log("ID =", id);
  console.log("Row:", rowToUpdate);
  console.log("Title:", title);
  console.log("Duration:", durationStr);
  console.log("Link:", link);
  const duration = convertDurationToMinutes(durationStr);
  //set the initial data equal to selected row:
  document.getElementById("title-input2").value = title;
  document.getElementById("duration-input2").value = duration;
  document.getElementById("url-input2").value = link;
}
//DELETE:
function handleRowDelete(btn) {
  console.log("inside handleRowDelete()");
  const rowToDelete = btn.parentElement.parentElement;
  console.log("ROW TO DELETE=", rowToDelete);
  const tds = rowToDelete.querySelectorAll("td"); //array of td's inside tr
  const title = tds[1].innerText;
  const durationStr = tds[2].innerText;
  const link = tds[3].querySelector("a").href;
  const id = rowToDelete.getAttribute("data-id");
  //   ID_OF_DELETE = id;
  console.log("ID =", id);
  console.log("Title:", title);
  console.log("Duration:", durationStr);
  console.log("Link:", link);
  fetch(`${BACKEND_API_URL}/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      fetchAndRefreshItems(CURRENT_FILTER);
    });
}