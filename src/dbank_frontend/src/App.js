import { html, render } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { dbank_backend } from '../../declarations/dbank_backend';
import dbank_html from './dbank.html'; 


class App {
  greeting = '';

  constructor() {
    this.#render();
  }

  #handleSubmit = async (e) => {
    e.preventDefault();

    const button = e.target.querySelector("#submit-btn");
    button.setAttribute("disabled", true);

    const inputAmount = parseFloat(document.getElementById("input-amount").value);
    const outputAmount = parseFloat(document.getElementById("withdrawal-amount").value);
  
    console.log("inputAmount", inputAmount);
    console.log("outputAmount", outputAmount);

    if (document.getElementById("input-amount").value.length != 0) {
      await dbank_backend.topUp(inputAmount);
      console.log("top up");
    } else if (document.getElementById("withdrawal-amount").value.length != 0) {
      await dbank_backend.withdraw(outputAmount);
      console.log("withdraw");
    } else {
      button.removeAttribute("disabled");
      console.log("Both is Empty");
      return;
    }
  
    await dbank_backend.compound();
  
    console.log("Done");

    document.getElementById("input-amount").value = "";
    document.getElementById("withdrawal-amount").value = "";
  
    button.removeAttribute("disabled");
    this.#render();
  };

  async #render() {
    try {
      var currentBalance = await dbank_backend.checkBalance();
      console.log("1. currentBalance: ", currentBalance);
      currentBalance = Math.round(currentBalance * 100) / 100;
      console.log("2. currentBalance: ", currentBalance);
      
      const htmlWithBalance = dbank_html.replace('{{balance}}', currentBalance);
      const body = html`${unsafeHTML(htmlWithBalance)}`;
      render(body, document.getElementById('root'));
      document.querySelector('form').addEventListener('submit', this.#handleSubmit);
    } catch (error) {
      console.error('Error fetching current balance:', error);
    }
  }
}

export default App;
