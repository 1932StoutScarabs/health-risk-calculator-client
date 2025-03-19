window.onload = async function() {
    document.querySelector("#custom-button").addEventListener("click", async () => {
        const age = parseInt(document.querySelector("#age").value) || 0;
        const heightFeet = parseInt(document.querySelector("#height-feet").value) || 0;
        const heightInches = parseInt(document.querySelector("#height-inches").value) || 0;
        const weight = parseInt(document.querySelector("#weight").value) || 0;
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
            weight,
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

            const data = await response.json();  // Changed from .text() to .json()

            console.log("Server response:", data);

            // Updated to handle the data object properly
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

