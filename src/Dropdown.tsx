/** @jsx h */

import { h } from 'preact';

import { Template } from './Template';
import {
  AutocompleteItem,
  AutocompleteState,
  RequiredAutocompleteProps,
  AutocompleteSetters,
} from './types';

interface DropdownProps extends AutocompleteState {
  position: Pick<ClientRect, 'left' | 'top'> | undefined;
  hidden: boolean;
  templates: RequiredAutocompleteProps['templates'];
  onClick: RequiredAutocompleteProps['onClick'];
  transformResultsRender: RequiredAutocompleteProps['transformResultsRender'];
  setters: AutocompleteSetters;
  getItemProps(options?: object): any;
  getMenuProps(options?: object): any;
}

export const Dropdown = ({
  position,
  hidden,
  isOpen,
  isStalled,
  isLoading,
  query,
  error,
  context,
  results,
  templates,
  transformResultsRender,
  setters,
  onClick,
  getItemProps,
  getMenuProps,
}: DropdownProps) => {
  const state = {
    isOpen,
    isStalled,
    isLoading,
    query,
    error,
    context,
    results,
  };

  return (
    <div
      className={[
        'algolia-autocomplete-dropdown',
        isStalled && 'algolia-autocomplete-dropdown--stalled',
        error && 'algolia-autocomplete-dropdown--errored',
      ]
        .filter(Boolean)
        .join(' ')}
      style={position}
      hidden={hidden}
    >
      <div className="algolia-autocomplete-dropdown-container">
        <Template
          tagName="header"
          data={{
            state,
            ...setters,
          }}
          template={templates.header}
          rootProps={{
            className: 'algolia-autocomplete-header',
          }}
        />

        {transformResultsRender(
          results.map((result, index) => {
            const { source, suggestions } = result;

            return (
              <section
                key={`result-${index}`}
                className="algolia-autocomplete-suggestions"
              >
                <Template
                  tagName="header"
                  data={{
                    state,
                    ...setters,
                  }}
                  template={source.templates.header}
                  rootProps={{
                    className: 'algolia-autocomplete-suggestions-header',
                  }}
                />

                {!state.isLoading && suggestions.length === 0 ? (
                  <Template
                    data={{
                      state,
                      ...setters,
                    }}
                    template={source.templates.empty}
                  />
                ) : (
                  <ul
                    {...getMenuProps(
                      {},
                      // @TODO: remove `suppressRefError`
                      // @ts-ignore
                      // See https://github.com/downshift-js/downshift#getmenuprops
                      { suppressRefError: true }
                    )}
                  >
                    {suggestions.map((suggestion, index) => {
                      const item: AutocompleteItem = {
                        suggestionValue: source.getInputValue({
                          suggestion,
                          state,
                        }),
                        suggestion,
                        source,
                      };

                      return (
                        <Template
                          tagName="li"
                          rootProps={{
                            key: `suggestion-${index}`,
                            className: 'algolia-autocomplete-suggestions-item',
                            ...getItemProps({
                              item,
                              tabIndex: 0,
                              onClick: (event: MouseEvent) =>
                                onClick(event, {
                                  suggestion: item.suggestion,
                                  suggestionValue: item.suggestionValue,
                                  source: item.source,
                                  state,
                                  ...setters,
                                }),
                            }),
                          }}
                          data={{
                            suggestion,
                            state,
                            ...setters,
                          }}
                          template={source.templates.suggestion}
                        />
                      );
                    })}
                  </ul>
                )}

                <Template
                  tagName="footer"
                  data={{
                    state,
                    ...setters,
                  }}
                  template={source.templates.footer}
                  rootProps={{
                    className: 'algolia-autocomplete-suggestions-footer',
                  }}
                />
              </section>
            );
          })
        )}

        <Template
          tagName="footer"
          data={{
            state,
            ...setters,
          }}
          template={templates.footer}
          rootProps={{
            className: 'algolia-autocomplete-footer',
          }}
        />
      </div>
    </div>
  );
};
