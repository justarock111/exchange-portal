const { createWorker } = Tesseract;

console.log('create worker func is ');
console.log(Tesseract);

const submissionBox =  document.querySelector('#image_input');

const inputArray = $('input');
const progressText = document.querySelector('#progress-text');
const loadingModal = $(".loading-modal").eq(0);

console.log('LOADING MODAL IS ');
console.log(loadingModal);

//TESSERACT WORKER SETUP
var status, prog;
const worker = createWorker({
    logger: m => {
     prog = (m.progress * 100).toFixed(0) + '%';
      status = m.status !== 'recognizing text'? 'setting up': m.status;
     progressText.innerText = `${status}...${prog}`;
     console.log(m);// Add logger here
    }
});


console.log('INPUT ARRAY IS: ');
console.log(inputArray);

console.log('INPUT ARRAY AT 0 POS IS: ');

console.log(inputArray[1]);

submissionBox.addEventListener('change', () => {
    if(!submissionBox.files)
        return null;

    const image = submissionBox.files[0];
    console.log('found file is');
    console.log(image);

    var parsedObject, parsedText, currString, startIndex, endIndex;




   (async () => {
               await  loadingModal.addClass('loading');
               await  console.log('TRYING TO LOAD WORKER');
               await worker.load();
               await worker.loadLanguage('eng');
               await worker.initialize('eng');
               await  console.log('SET THE SETTINGS ALR');
               parsedObject = await worker.recognize(image);
               await worker.terminate();

               console.log('PARSED OBJECT IS: ');
               console.log(parsedObject);

              parsedText = parsedObject.data.text;

               startIndex = parsedText.indexOf('Module Code:');
               endIndex = parsedText.indexOf('Module Subject Area:');
               currString = parsedText.substring(startIndex + 12, endIndex).trim();
               var firstStringIndex = currString.indexOf(" ");
               var firstString = currString.substring(-1, firstStringIndex).replace(/\W/g, '');

               var secondString = currString.substring(firstStringIndex, currString.length).replace(/\W/g, '');
               console.log('1. module code part one is: ' + firstString);
                inputArray[1].value = firstString;
               console.log('1. module code part two is: ' + secondString);
                inputArray[2].value = secondString;

               startIndex = endIndex;
               endIndex = parsedText.indexOf('Module Title:');
               currString = parsedText.substring(startIndex + 20, endIndex).trim().replace(/\W/g, '');
               console.log('1. module subject area is: ' + currString);
                inputArray[5].value = currString;

               startIndex = endIndex;
               endIndex = parsedText.indexOf('Module Catalog Nbr:');
               currString = parsedText.substring(startIndex + 13, endIndex).trim().replace(/\W/g, '');
               console.log('2. module title is: ' + currString);
                inputArray[3].value = currString;

               startIndex = endIndex;
               endIndex = parsedText.indexOf('Units/Credits:');
               currString = parsedText.substring(startIndex + 19, endIndex).trim().replace(/\W/g, '');
               console.log('3. module catalog number is ' + currString);
               inputArray[6].value = currString;

               startIndex = endIndex;
               endIndex = parsedText.indexOf('Course ID:');
               currString = parsedText.substring(startIndex + 14, endIndex).trim().replace(/[^0-9.]/g, '');
               console.log('4. credits is ' + currString);
                inputArray[4].value = currString;

               startIndex = parsedText.indexOf('Module Synopsis:');
               endIndex = parsedText.indexOf('Course ID:');
               currString = parsedText.substring(startIndex + 14, endIndex).trim().replace(/\W/g, '');
               console.log('6. synopsis is ' + currString);


               startIndex = parsedText.indexOf('Lecture');
               endIndex = parsedText.indexOf('Exam');
               currString = parsedText.substring(startIndex + 7, endIndex).trim().replace(/[^0-9.]/g, '');
               console.log('7. lecture contact hours is ' + currString);
               inputArray[9].value = currString;

               startIndex = parsedText.indexOf('Exam');
               endIndex = parsedText.indexOf('Tutorials');
               currString = parsedText.substring(startIndex + 4, endIndex).trim().replace(/[^0-9.]/g, '');
               console.log('8. exam weightage is ' + currString);
               inputArray[14].value = currString;

               startIndex = endIndex;
               endIndex = parsedText.indexOf('Assignments');
               currString = parsedText.substring(startIndex + 9, endIndex).trim().replace(/[^0-9.]/g, '');
               console.log('9. tutorial contact hours is ' + currString);
               inputArray[10].value = currString;

               startIndex = endIndex;
               endIndex = parsedText.indexOf('Practicals/Lab');
               currString = parsedText.substring(startIndex + 11, endIndex).trim().replace(/[^0-9.]/g, '');
               console.log('9. assignment weightage is ' + currString);
               inputArray[15].value = currString;


               startIndex = endIndex;
               endIndex = parsedText.indexOf('Quiz');
               currString = parsedText.substring(startIndex + 15, endIndex).trim().replace(/[^0-9.]/g, '');
               console.log('10. practicals/labs contact hours is ' + currString);
               inputArray[11].value = currString;

               startIndex = endIndex;
               endIndex = parsedText.indexOf('Others');
               currString = parsedText.substring(startIndex + 4, endIndex).trim().replace(/[^0-9.]/g, '');
               console.log('11. quiz weightage is ' + currString);
               inputArray[16].value = currString;

               startIndex = endIndex;
               endIndex = parsedText.split('Others', 2).join('Others').length;//2nd instance
               currString = parsedText.substring(startIndex + 6, endIndex).trim().replace(/[^0-9.]/g, '');
               console.log('12. others contact hours is ' + currString);
               inputArray[12].value = currString;

               startIndex = endIndex;
               endIndex = parsedText.indexOf('Weeks of Instruction:');
               currString = parsedText.substring(startIndex + 6, endIndex).trim().replace(/[^0-9.]/g, '');
               console.log('13. others weightage is ' + currString);
               inputArray[17].value = currString;

               startIndex = endIndex;
               endIndex = parsedText.indexOf('Total Weightage(in %):');
               currString = parsedText.substring(startIndex + 22, endIndex).trim().replace(/[^0-9]/g, '');
               console.log('14. weeks of instruction is ' + currString);
               inputArray[19].value = currString;

               startIndex = endIndex;
               endIndex = parsedText.indexOf('URL for Module Details:');
               currString = parsedText.substring(startIndex + 23, endIndex).trim().replace(/[^0-9.]/g, '');
               console.log('15. total weightage is ' + currString);
               inputArray[20].value = currString;

               startIndex = endIndex;
               endIndex = parsedText.indexOf('Other Information:');
               currString = parsedText.substring(startIndex + 23, endIndex).trim();
               console.log('16, url mod details is ' + currString);
               inputArray[21].value = currString;

               startIndex = endIndex;
               endIndex = parsedText.indexOf('Indicate th');
               currString = parsedText.substring(startIndex + 11, endIndex).trim().replace(/[^0-9a-z\s-,|\/\\]/g, '');
               console.log('17, other information is ' + currString);
               inputArray[22].value = currString;

               startIndex = parsedText.indexOf('Requisites modules');
               endIndex = parsedText.indexOf('passed for NUS mapped');
               currString = parsedText.substring(startIndex + 18, endIndex).trim().replace(/[^0-9a-zA-Z\s-,|\/\\]/g, '');
               console.log('18, prerequisite is ' + currString);
               inputArray[23].value = currString;


               startIndex = parsedText.indexOf('Mapping Status:');
                endIndex = parsedText.indexOf('Processed By:');
                currString = parsedText.substring(startIndex + 15, endIndex).trim().replace(/[^a-zA-Z]/g, '');
                console.log('18, mapping status is ' + currString);


               startIndex = parsedText.split('Units/Credits: ', 2).join('Units/Credits: ').length;//2nd instance
               endIndex = startIndex + 19
               currString = parsedText.substring(startIndex + 15, endIndex).trim().replace(/[^0-9.]/g, '');
               console.log('19. local module credit is ' + currString);
               inputArray[8].value = currString;

                var lineIndex, parsedLines, endLineIndex;
                parsedLines =  parsedObject.data.lines.map(linesObject => linesObject.text);
                console.log('PARSED LINES ARE: ');
                console.log(parsedLines);
                lineIndex = parsedLines.findIndex(line => line.includes('Module Synopsis:')) + 1;
                endIndex = parsedLines[lineIndex].indexOf('Offer Nbr:');
                currString = parsedLines[lineIndex].substring(-1, endIndex).trim();
                console.log('20A. First line is (with line index '+ lineIndex + '):' + currString);

                lineIndex++;
                endIndex = parsedLines[lineIndex].indexOf('Module Title:');
                currString += '\n' + parsedLines[lineIndex].substring(-1, endIndex).trim();
               console.log('20A. Second line is (with line index '+ lineIndex + '):' + currString);

                firstString = parsedLines.find(line => line.includes('Units/Credits:'));
                endLineIndex = parsedLines.findIndex(line => line.includes('Units/Credits:') && line !== firstString);
                console.log('THE INDEX THAT INCLUDES UNITS/CREDITS IS ' + endLineIndex);

                for(lineIndex++ ; lineIndex < endLineIndex; lineIndex++){
                    currString += '\n'+ parsedLines[lineIndex];
                  console.log('20A. Middle line is (with line index '+ lineIndex + '):' + currString);
                }

                endIndex =  parsedLines[endLineIndex].indexOf('Units/Credits:');
                currString +=  '\n' + parsedLines[lineIndex].substring(-1, endIndex).trim();
                console.log('20A. Last line is (with line index '+ lineIndex + '):' + currString);

                currString.replace(/[^0-9a-zA-Z\s-,|\/\\.]/g, '');
                console.log('20. module synopsis is: ' + currString );
                $('textarea')[0].value = currString;

                firstString = parsedLines.find(line => line.includes('Module Title:'));
                lineIndex =  parsedLines.findIndex(line => line.includes('Module Title:') && line !== firstString);
                console.log('ARRAY INDEX FOR MODULE TITLE LINE IS: ' + lineIndex);
                if(lineIndex !== -1){
                currString = parsedLines[lineIndex].trim().replace(/[^0-9a-zA-Z\s-,]/g, '');;
                startIndex = currString.indexOf('Module Title:');
                currString = currString.substring(startIndex + 13, currString.length).trim();
                console.log('21. local module title is : ' + currString );
                inputArray[7].value = currString;
                }

                loadingModal.removeClass('loading');
                progressText.innerText = '';

           })();
   })





