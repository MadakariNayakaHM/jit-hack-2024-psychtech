function downloadSection(sectionToDownload, downloadButton)
{
    document.getElementById(downloadButton).addEventListener('click', function () {
        // Get the HTML element of the section with the id "sectionToDownload"
        var sectionElement = document.getElementById(sectionToDownload);
    
        // Use html2canvas to capture the section as an image
        html2canvas(sectionElement).then(function (canvas) {
            // Convert the canvas to a data URL
            var dataUrl = canvas.toDataURL();
    
            // Create a link element
            var link = document.createElement('a');
    
            // Set the download attribute with a desired filename
            link.download = 'section_content.png';
    
            // Set the href attribute with the data URL
            link.href = dataUrl;
    
            // Append the link to the document
            document.body.appendChild(link);
    
            // Trigger a click on the link to start the download
            link.click();
    
            // Remove the link from the document
            document.body.removeChild(link);
        });
    });
    
}

downloadSection("sectionToDownload", "downloadButton")