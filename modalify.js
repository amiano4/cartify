const modalify = {
  createDialogELement() {
    const dialog = document.createElement('div');

    dialog.setAttribute('class', 'modalify-container');
    dialog.innerHTML = /*html*/ `
      <div class="modalify-content">
        <div class="modalify-header">
          <h3 class="modalify-title"></h3>
          <button type="button" class="modalify-close btn-close"></button>
        </div>
        <div class="modalify-body"></div>
        <div class="modalify-footer"></div>
      </div>
    `;

    // modal close button
    dialog.querySelector('.modalify-close').addEventListener('click', function() {
      dialog.remove();
    });

    // background click
    dialog.addEventListener('click', function() {
      dialog.remove();
    });

    // prevent modal dialog to close when content is clicked
    dialog.querySelector('.modalify-content').addEventListener('click', function(event) {
      event.stopPropagation();
    });

    return dialog;
  },
  confirm(title = "Are you sure?", message = "Please confirm") {
    const self = this;

    return new Promise(function(resolve, reject) {
      const modal = self.createDialogELement();
      modal.querySelector('.modalify-title').innerHTML = title;
      modal.querySelector('.modalify-body').innerHTML = message;
      modal.querySelector('.modalify-footer').innerHTML = /*html*/ `
        <button type="button" class="cancel-btn btn btn-cancel">Cancel</button>
        <button type="button" class="confirm-btn btn btn-primary">Confirm</button>
      `;

      // cancel button
      modal.querySelector('.modalify-footer .cancel-btn').addEventListener('click', function() {
        modal.remove();
        resolve({ isCancelled: true });
      });

      // confirm button
      modal.querySelector('.modalify-footer .confirm-btn').addEventListener('click', function() {
        modal.remove();
        resolve({ isConfirmed: true });
      });

      document.body.append(modal);
    });
  },
  ok(title = "", message = "Success") {
    const self = this;

    return new Promise(function(resolve, reject) {
      const modal = self.createDialogELement();
      modal.querySelector('.modalify-title').innerHTML = title;
      modal.querySelector('.modalify-body').innerHTML = message;
      modal.querySelector('.modalify-footer').innerHTML = /*html*/ `
        <button type="button" class="ok-btn btn btn-primary">OK</button>
      `;

      // ok button
      modal.querySelector('.modalify-footer .ok-btn').addEventListener('click', function() {
        modal.remove();
        resolve({ });
      });

      document.body.append(modal);
    });
  }
}
