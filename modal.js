class Modal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
    const style = `
    <style>
    #backdrop{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0,0,0,0.75);
        z-index= 10;
        opacity:0;
        pointer-events: none;
    }

    :host([opened]) #backdrop,
    :host([opened]) #modal
    {
        opacity:1;
        pointer-events: all;
    }
    
    :host([opened]) #modal
    {
        top: 50%;
        
    }
    

    #modal{
        background-color:#fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.26);
        border-radius: 3px; 
        position: fixed;
        left:50%;
        top:35%;
        transform: translate(-50%,-50%);
        z-index: 100; 
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-family: sans-serif;
        width: 75%;
        opacity:0;
        pointer-events: none;
        transition: all 0.4s ease-in-out;
    }

    header {
        padding: 1rem;
        border-bottom: 1px solid #ccc;
    }

    ::slotted(h1) {
        font-size: 1.25rem;
        margin: 0;
    }

    #main {
        padding: 1rem;
    }

    #actions {
        border-top: 1px solid #ccc;
        padding: 1rem;
        display: flex;
        justify-content: flex-end;
    }

    #actions button {
        margin: 0 0.25rem;
    }
</style>    `;
    this.shadowRoot.innerHTML = `
        ${style}
        <div id='backdrop'></div>
        <div id='modal'>
            <header>
                <slot name='title'>Please Confirm Payment</slot>
            </header>
            <section id='main'>
                <slot name='main'>With your confirmation you are accepting full charge</slot>
            </section>
            <section id='actions'>
                <button id='confirm-btn' >Confirm</button>
                <button id='cancel-btn'>Cancel</button>
            </section>
        </div>
        `;

    const slots = this.shadowRoot.querySelectorAll("slot");
    // slots[1].addEventListener('slotchange', event =>{
    //     console.dir(slots[1].assignedNodes());
    // });
    const cancelButton = this.shadowRoot.getElementById("cancel-btn");
    const confirmButton = this.shadowRoot.getElementById("confirm-btn");
    const backdrop = this.shadowRoot.getElementById("backdrop");
    cancelButton.addEventListener("click", this._cancel.bind(this));
    confirmButton.addEventListener("click", this._confirm.bind(this));
    backdrop.addEventListener("click", this._cancel.bind(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.hasAttribute("opened")) {
      this.isOpen = true;
      //     this.shadowRoot.querySelector('#backdrop').style.opacity = 1;
      //     this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'all';
      //     this.shadowRoot.querySelector('#modal').style.opacity = 1;
      //     this.shadowRoot.querySelector('#modal').style.pointerEvents = 'all';
    } else {
      this.isOpen = false;
    }
  }

  static get observedAttributes() {
    return ["opened"];
  }

  open() {
    this.setAttribute("opened", "");
    this.isOpen = true;
  }

  hide() {
    if (this.hasAttribute("opened")) {
      this.removeAttribute("opened");
    }
    this.isOpen = false;
  }

  _confirm() {
    this.hide();
    const confirmEvent = new Event('confirm');
    this.dispatchEvent(confirmEvent);
  }

  _cancel(e) {
    this.hide();
    //composed allows the event to leave the shadowDOM
    const cancelEvent = new Event('cancel', { bubbles: true, composed: true });
    e.target.dispatchEvent(cancelEvent);
  }
}

customElements.define("uc-modal", Modal);
