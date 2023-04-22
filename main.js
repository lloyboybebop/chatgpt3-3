document.getElementById('chatgpt-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const prompt = document.getElementById('prompt').value;
    const plugins = Array.from(document.getElementsByName('plugins'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value)
        .join(',');

    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt,
            plugins: plugins
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('An error occurred while generating the text.');
        }
    })
    .then(data => {
        let generatedText = data.generated_text;
        
        // Yes Man Plugin
        if (plugins.includes('yes_man')) {
            const YES_MAN_PLUGIN = {
                name: "Yes Man",
                priority: 1,
                action: function (prompt, generatedText) {
                    return generatedText.replaceAll(/(no|not)/gi, "yes");
                }
            }
        }
        
        // Internet Search Plugin
        if (plugins.includes('internet_search')) {
            const searchRegex = /\[(.*?)\]/;
            const match = generatedText.match(searchRegex);
            if (match) {
                const searchTerm = match[1];
                generatedText = generatedText.replace(searchRegex, `<a href="https://www.google.com/search?q=${searchTerm}" target="_blank">${searchTerm}</a>`);
            }
        }
        
        document.getElementById('generated-text').innerHTML = generatedText;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});