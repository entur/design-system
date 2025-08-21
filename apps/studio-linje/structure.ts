export const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      // Component Documentation
      S.listItem()
        .title('Komponentdokumentasjon (TEST)')
        .child(
          S.list()
            .title('Komponentdokumentasjon(TEST)')
            .items([
              S.listItem()
                .title('Alle komponentdokumenter')
                .child(
                  S.documentTypeList('componentDoc')
                    .apiVersion('2025-02-10')
                    .title('Alle komponentdokumenter')
                    .defaultOrdering([
                      {field: 'category', direction: 'asc'},
                      {field: 'subcategory', direction: 'asc'},
                      {field: 'title', direction: 'asc'},
                    ])
                ),
              S.listItem()
                .title('Komponenter')
                .child(
                  S.list()
                    .title('Komponenter underkategorier')
                    .items([
                      S.listItem()
                        .title('Alle komponentdokumenter under Komponenter')
                        .child(
                          S.documentTypeList('componentDoc')
                            .apiVersion('2025-02-10')
                            .title('Komponenter-dokumenter')
                            .filter('category == "Komponenter"')
                            .defaultOrdering([
                              {field: 'subcategory', direction: 'asc'},
                              {field: 'title', direction: 'asc'},
                            ])
                        ),
                      S.listItem()
                        .title('Knapper')
                        .child(
                          S.documentTypeList('componentDoc')
                            .apiVersion('2025-02-10')
                            .title('Knapper-dokumenter')
                            .filter('category == "Komponenter" && subcategory == "Knapper"')
                            .defaultOrdering([{field: 'title', direction: 'asc'}])
                        ),
                      S.listItem()
                        .title('Feedback')
                        .child(
                          S.documentTypeList('componentDoc')
                            .apiVersion('2025-02-10')
                            .title('Feedback-dokumenter')
                            .filter('category == "Komponenter" && subcategory == "Feedback"')
                            .defaultOrdering([{field: 'title', direction: 'asc'}])
                        ),
                      S.listItem()
                        .title('Layout og flater')
                        .child(
                          S.documentTypeList('componentDoc')
                            .apiVersion('2025-02-10')
                            .title('Layout og flater-dokumenter')
                            .filter(
                              'category == "Komponenter" && subcategory == "Layout og flater"'
                            )
                            .defaultOrdering([{field: 'title', direction: 'asc'}])
                        ),
                      S.listItem()
                        .title('Navigasjon')
                        .child(
                          S.documentTypeList('componentDoc')
                            .apiVersion('2025-02-10')
                            .title('Navigasjon-dokumenter')
                            .filter('category == "Komponenter" && subcategory == "Navigasjon"')
                            .defaultOrdering([{field: 'title', direction: 'asc'}])
                        ),
                      S.listItem()
                        .title('Reise')
                        .child(
                          S.documentTypeList('componentDoc')
                            .apiVersion('2025-02-10')
                            .title('Reise-dokumenter')
                            .filter('category == "Komponenter" && subcategory == "Reise"')
                            .defaultOrdering([{field: 'title', direction: 'asc'}])
                        ),
                      S.listItem()
                        .title('Ressurser')
                        .child(
                          S.documentTypeList('componentDoc')
                            .apiVersion('2025-02-10')
                            .title('Ressurser-dokumenter')
                            .filter('category == "Komponenter" && subcategory == "Ressurser"')
                            .defaultOrdering([{field: 'title', direction: 'asc'}])
                        ),
                      S.listItem()
                        .title('Skjemaelementer')
                        .child(
                          S.documentTypeList('componentDoc')
                            .apiVersion('2025-02-10')
                            .title('Skjemaelementer-dokumenter')
                            .filter('category == "Komponenter" && subcategory == "Skjemaelementer"')
                            .defaultOrdering([{field: 'title', direction: 'asc'}])
                        ),
                    ])
                ),
            ])
        ),

      // Pages organized in fully dynamic folder structure
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages by Category')
            .items([
              // Alle sider under Pages view
              S.listItem()
                .title('Alle sider')
                .child(
                  S.documentTypeList('page')
                    .apiVersion('2025-02-10')
                    .title('Alle sider')
                    .apiVersion('2025-02-10')
                    .defaultOrdering([
                      {field: 'category', direction: 'asc'},
                      {field: 'subcategory', direction: 'asc'},
                      {field: 'title', direction: 'asc'},
                    ])
                ),

              // Dynamic category folders using GROQ queries
              S.listItem()
                .title('Kategorier')
                .child(
                  S.list()
                    .title('Alle kategorier')
                    .items([
                      // Dynamic category discovery
                      S.listItem()
                        .title('Komponenter')
                        .child(
                          S.list()
                            .title('Komponenter underkategorier')
                            .items([
                              S.listItem()
                                .title('Alle sider under Komponenter')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Komponenter-sider')
                                    .apiVersion('2025-02-10')
                                    .filter('category == "Komponenter"')
                                    .defaultOrdering([
                                      {field: 'subcategory', direction: 'asc'},
                                      {field: 'title', direction: 'asc'},
                                    ])
                                ),
                              // Dynamic subcategories for Komponenter
                              S.listItem()
                                .title('Knapper')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Knapper-sider')
                                    .apiVersion('2025-02-10')
                                    .filter('category == "Komponenter" && subcategory == "Knapper"')
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                              S.listItem()
                                .title('Feedback')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Feedback-sider')
                                    .apiVersion('2025-02-10')
                                    .filter(
                                      'category == "Komponenter" && subcategory == "Feedback"'
                                    )
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                              S.listItem()
                                .title('Layout og flater')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Layout og flater-sider')
                                    .filter(
                                      'category == "Komponenter" && subcategory == "Layout og flater"'
                                    )
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                              S.listItem()
                                .title('Navigasjon')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Navigasjon-sider')
                                    .filter(
                                      'category == "Komponenter" && subcategory == "Navigasjon"'
                                    )
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                              S.listItem()
                                .title('Reise')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Reise-sider')
                                    .filter('category == "Komponenter" && subcategory == "Reise"')
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                              S.listItem()
                                .title('Ressurser')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Ressurser-sider')
                                    .filter(
                                      'category == "Komponenter" && subcategory == "Ressurser"'
                                    )
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                              S.listItem()
                                .title('Skjemaelementer')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Skjemaelementer-sider')
                                    .filter(
                                      'category == "Komponenter" && subcategory == "Skjemaelementer"'
                                    )
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                            ])
                        ),

                      // Dynamic category discovery for other categories
                      S.listItem()
                        .title('Identitet')
                        .child(
                          S.list()
                            .title('Identitet underkategorier')
                            .items([
                              S.listItem()
                                .title('Alle sider under Identitet')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Identitet-sider')
                                    .filter('category == "Identitet"')
                                    .defaultOrdering([
                                      {field: 'subcategory', direction: 'asc'},
                                      {field: 'title', direction: 'asc'},
                                    ])
                                ),
                              S.listItem()
                                .title('Introduksjon')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Introduksjon-sider')
                                    .filter(
                                      'category == "Identitet" && subcategory == "Introduksjon"'
                                    )
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                              S.listItem()
                                .title('Maler')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Maler-sider')
                                    .filter('category == "Identitet" && subcategory == "Maler"')
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                              S.listItem()
                                .title('Verktøykassen')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Verktøykassen-sider')
                                    .filter(
                                      'category == "Identitet" && subcategory == "Verktøykassen"'
                                    )
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                            ])
                        ),

                      S.listItem()
                        .title('Kom i gang')
                        .child(
                          S.list()
                            .title('Kom i gang underkategorier')
                            .items([
                              S.listItem()
                                .title('Alle sider under Kom i gang')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Kom i gang-sider')
                                    .filter('category == "Kom i gang"')
                                    .defaultOrdering([
                                      {field: 'subcategory', direction: 'asc'},
                                      {field: 'title', direction: 'asc'},
                                    ])
                                ),
                              S.listItem()
                                .title('For designere')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('For designere-sider')
                                    .filter(
                                      'category == "Kom i gang" && subcategory == "For designere"'
                                    )
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                              S.listItem()
                                .title('For utviklere')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('For utviklere-sider')
                                    .filter(
                                      'category == "Kom i gang" && subcategory == "For utviklere"'
                                    )
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                              S.listItem()
                                .title('Introduksjon')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Introduksjon-sider')
                                    .filter(
                                      'category == "Kom i gang" && subcategory == "Introduksjon"'
                                    )
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                            ])
                        ),

                      S.listItem()
                        .title('Mønster')
                        .child(
                          S.list()
                            .title('Mønster underkategorier')
                            .items([
                              S.listItem()
                                .title('Alle sider under Mønster')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Mønster-sider')
                                    .filter('category == "Mønster"')
                                    .defaultOrdering([
                                      {field: 'subcategory', direction: 'asc'},
                                      {field: 'title', direction: 'asc'},
                                    ])
                                ),
                              S.listItem()
                                .title('Mønster')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Mønster-sider')
                                    .filter('category == "Monster" && subcategory == "Monster"')
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                            ])
                        ),

                      S.listItem()
                        .title('Ressurser')
                        .child(
                          S.list()
                            .title('Ressurser underkategorier')
                            .items([
                              S.listItem()
                                .title('Alle sider under Ressurser')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Ressurser-sider')
                                    .filter('category == "Ressurser"')
                                    .defaultOrdering([
                                      {field: 'subcategory', direction: 'asc'},
                                      {field: 'title', direction: 'asc'},
                                    ])
                                ),
                              S.listItem()
                                .title('Workshopmaler')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Workshopmaler-sider')
                                    .filter(
                                      'category == "Ressurser" && subcategory == "Workshopmaler"'
                                    )
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                            ])
                        ),

                      S.listItem()
                        .title('Tokens')
                        .child(
                          S.list()
                            .title('Tokens underkategorier')
                            .items([
                              S.listItem()
                                .title('Alle sider under Tokens')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Tokens-sider')
                                    .filter('category == "Tokens"')
                                    .defaultOrdering([
                                      {field: 'subcategory', direction: 'asc'},
                                      {field: 'title', direction: 'asc'},
                                    ])
                                ),
                              S.listItem()
                                .title('Fargetokens')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Fargetokens-sider')
                                    .filter('category == "Tokens" && subcategory == "Fargetokens"')
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                              S.listItem()
                                .title('Øvrige tokens')
                                .child(
                                  S.documentTypeList('page')
                                    .apiVersion('2025-02-10')
                                    .title('Øvrige tokens-sider')
                                    .filter(
                                      'category == "Tokens" && subcategory == "Øvrige tokens"'
                                    )
                                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                                ),
                            ])
                        ),

                      S.listItem()
                        .title('Universell utforming')
                        .child(
                          S.documentTypeList('page')
                            .apiVersion('2025-02-10')
                            .title('Universell utforming-sider')
                            .filter('category == "Universell utforming"')
                            .defaultOrdering([{field: 'title', direction: 'asc'}])
                        ),
                    ])
                ),
            ])
        ),
    ])
