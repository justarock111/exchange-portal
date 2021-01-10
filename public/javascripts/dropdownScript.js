function showModuleMappings(faculty)
 {
    var moduleCard = `      <div class="module-mapping-container">
                             <a class="module-mapping-card-link" href="/schools/<%= school._id %>/<%= faculty._id %>/module_mappings/<%= moduleMapping._id %>">
                              <div class="card-group module-mapping-card">
                                  <div class="card local-module">
                                      <div class="card-body">
                                          <div class="module-code"><%= moduleMapping.localModuleCode %></div>
                                          <p class="module-name"><%= moduleMapping.localModuleName %></p>
                                      </div>
                                  </div>

                                  <i class="fas fa-caret-right"></i>

                                  <div class="card host-module">
                                      <div class="card-body">
                                          <div class="module-code"><%= moduleMapping.moduleCode %> </div>
                                          <p class="module-name"><%= moduleMapping.moduleName %></p>
                                      </div>
                                  </div>



                              </div
                             </a>

                             </div>`;
     var moduleCard = $.parseHTML(moduleCard);
     var parentDiv = $('.module-mappings-div');
     console.log(moduleCard.childNodes);

    faculty.moduleMappings.forEach(moduleMapping => {

      parentDiv.append(moduleCard);
   })
 }