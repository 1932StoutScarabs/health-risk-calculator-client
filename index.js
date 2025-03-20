window.onload = async function() {
    // Add validation functions
    function validateWeight(weight) {
        const numWeight = parseFloat(weight);
        if (isNaN(numWeight)) {
            return { isValid: false, message: "Please enter a valid number for weight" };
        }
        if (numWeight < 50 || numWeight > 500) {
            return { isValid: false, message: "Weight must be between 50 and 500 pounds" };
        }
        return { isValid: true, value: numWeight };
    }

    function validateHeight(feet, inches) {
        const totalInches = feet * 12 + inches;
        if (totalInches < 24 || totalInches > 108) {
            return { isValid: false, message: "Please enter a valid height" };
        }
        return { isValid: true, value: totalInches };
    }

    function showError(element, message) {
        element.style.borderColor = "#ff0000";
        element.style.backgroundColor = "#fff0f0";
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.style.color = "#ff0000";
        errorDiv.style.fontSize = "0.8rem";
        errorDiv.style.marginTop = "5px";
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
    }

    function clearError(element) {
        element.style.borderColor = "#ddd";
        element.style.backgroundColor = "#f8f9fa";
        const errorDiv = element.parentNode.querySelector(".error-message");
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    document.querySelector("#custom-button").addEventListener("click", async () => {
        // Clear any existing errors
        document.querySelectorAll(".error-message").forEach(el => el.remove());
        document.querySelectorAll("input, select").forEach(el => {
            el.style.borderColor = "#ddd";
            el.style.backgroundColor = "#f8f9fa";
        });

        const age = parseInt(document.querySelector("#age").value) || 0;
        const heightFeet = parseInt(document.querySelector("#height-feet").value) || 0;
        const heightInches = parseInt(document.querySelector("#height-inches").value) || 0;
        const weightInput = document.querySelector("#weight");
        const weight = weightInput.value;

        // Validate weight
        const weightValidation = validateWeight(weight);
        if (!weightValidation.isValid) {
            showError(weightInput, weightValidation.message);
            return;
        }

        // Validate height
        const heightValidation = validateHeight(heightFeet, heightInches);
        if (!heightValidation.isValid) {
            showError(document.querySelector("#height-feet"), heightValidation.message);
            showError(document.querySelector("#height-inches"), heightValidation.message);
            return;
        }

        const bloodPressure = document.querySelector("#bloodPressure").value;

        // Get selected family history checkboxes
        const familyHistory = Array.from(document.querySelectorAll("input[name='options']:checked"))
                                  .map(checkbox => checkbox.value);

        const familyDiseaseCount = familyHistory.length;

        // Create object with form data
        const formData = {
            age,
            heightFeet,
            heightInches,
            weight: weightValidation.value,
            bloodPressure,
            familyDiseaseCount,
            familyHistory
        };

        console.log("Form data:", formData);

        try {
            const response = await fetch("https://health-risk-calculator-server-bxeyghe4h0bqe0fe.centralus-01.azurewebsites.net/calc-risk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData) 
            });

            const data = await response.json();

            console.log("Server response:", data);

            if (data && typeof data.BMI !== 'undefined' && typeof data.Risk !== 'undefined') {
                document.querySelector("#result-risk").textContent = `Risk: ${data.Risk}`;
                document.querySelector("#result-bmi").textContent = `BMI: ${data.BMI}`;
            } else {
                document.querySelector("#result-risk").textContent = "Invalid response format from server";
                document.querySelector("#result-bmi").textContent = "Invalid response format from server";
            }
        } catch (error) {
            console.error("Error:", error);
            document.querySelector("#result-risk").textContent = "Error calculating risk";
            document.querySelector("#result-bmi").textContent = "Error calculating BMI";
        }
    });

    // Ping the server to ensure it's awake
    pingServer();
};

//Ping the server to make sure it is awake
async function pingServer(){
    try{
        let response = await fetch("https://health-risk-calculator-server-bxeyghe4h0bqe0fe.centralus-01.azurewebsites.net/api/ping")
        let data = await response.text()
        console.log("Server wake-up", data)
    } catch (error){
        console.error("Error pinging server:", error)
    }
}

