/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import { GenericRelatedItemView, PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types/views';
import { ControlGroup, InputGroup, Tag } from '@blueprintjs/core';


export function openLinkInBrowser(link: string) {
  // Some dance in an attempt to detect Electron without inadvertently including it in a bundle
  if (typeof require !== 'undefined' && require.resolveWeak !== undefined) {
    try {
      const el = __webpack_modules__[require.resolveWeak('electron') as number];
      if (el) {
        el.shell.openExternal(link);
      }
    } catch (e) {
      console.error("Unable to open link in default browser", link, e);
    }
  } else if (typeof window !== 'undefined') {
    try {
      window.location.assign(link);
    } catch (e) {
      console.error("Unable to navigate to link", link, e);
    }
  }
}



interface CodeData {
  code: string
  fieldcode: string
  groupcode?: string
  subgroupcode?: string

  context?: string // JSON-LD URL
  description: string
  descriptionFull: string
  relationships: { type: 'related', to: string /* UUID */, text?: string }[]
  notes?: string[]
}


const code: ItemClassConfiguration<CodeData> = {
  meta: {
    title: "ICS code",
    description: "Represents a field, group, sub-group, or unit in the International Classification for Standards.",
    id: 'codes',
    alternativeNames: [],
  },
  defaults: {
    description: '',
    descriptionFull: '',
  },
  itemSorter: (p1, p2) => (p1.code || '').localeCompare(p2.code || ''),
  sanitizePayload: async (p) => p,
  validatePayload: async () => true,

  views: {
    listItemView: ({ itemData, className }) =>
      <span className={className}>
        <code>{itemData.code}</code>
        &emsp;
        {itemData.description}
      </span>,
    detailView: ({ itemData, className, useRegisterItemData, getRelatedItemClassConfiguration }) => {
      const {
        fieldcode, groupcode, subgroupcode,
        context,
        description, descriptionFull,
        relationships, notes,
      } = itemData;
      return (
        <div className={className}>
          <PropertyDetailView title="Code">
            <ControlGroup fill>
              <InputGroup readOnly leftIcon={<Tag minimal>Field</Tag>} value={fieldcode} />
              <InputGroup readOnly leftIcon={<Tag minimal>Group</Tag>} value={groupcode || '—'} />
              <InputGroup readOnly leftIcon={<Tag minimal>Subgroup</Tag>} value={subgroupcode || '—'} />
            </ControlGroup>
          </PropertyDetailView>
          <PropertyDetailView title="Context">
            {context
              ? <a onClick={() => openLinkInBrowser(context)}>{context}</a>
              : '—'}
          </PropertyDetailView>
          <PropertyDetailView title="Description">
            {description || '—'}
          </PropertyDetailView>
          <PropertyDetailView title="Full description">
            {descriptionFull || '—'}
          </PropertyDetailView>
          <PropertyDetailView title="Relationships">
            {relationships.map(r =>
              <div>
                <GenericRelatedItemView
                  useRegisterItemData={useRegisterItemData}
                  getRelatedItemClassConfiguration={getRelatedItemClassConfiguration}
                  itemRef={{ classID: 'codes', itemID: r.to }}
                />
                {r.text ? <p css={css`font-size: 80%; margin-top: .25rem;`}>{r.text}</p> : null}
              </div>
            )}
          </PropertyDetailView>
          <PropertyDetailView title="Notes">
            {(notes || []).map(n =>
              <div>
                <p css={css`margin-top: .25rem;`}>{n}</p>
              </div>
            )}
          </PropertyDetailView>
        </div>
      );
    },
    editView: () => <span>TBD</span>,
  },
};


export const itemClassConfiguration = {
  codes: code,
};