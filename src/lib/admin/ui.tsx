import type { AdminField, AdminResource } from './resources';
import { formatAdminValue } from './resources';

export type FieldOptions = Record<string, Array<{ value: string; label: string }>>;

const inputStyle = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box' as const,
  marginTop: 4,
  padding: '8px 10px',
  border: '1px solid #d1d5db',
  borderRadius: 6
};

const labelStyle = {
  display: 'grid',
  gap: 4,
  fontWeight: 600
};

function getInitialValue(field: AdminField, record?: Record<string, unknown>) {
  return record?.[field.name] ?? field.defaultValue ?? '';
}

function renderField(field: AdminField, record: Record<string, unknown> | undefined, fieldOptions: FieldOptions) {
  const initialValue = getInitialValue(field, record);
  const commonProps = {
    name: field.name,
    required: field.required,
    style: inputStyle
  };

  if (field.type === 'textarea') {
    return <textarea {...commonProps} defaultValue={formatAdminValue(initialValue)} rows={4} />;
  }

  if (field.type === 'number') {
    return <input {...commonProps} type="number" step={1} defaultValue={formatAdminValue(initialValue)} />;
  }

  if (field.type === 'checkbox') {
    return <input name={field.name} type="checkbox" defaultChecked={Boolean(initialValue)} />;
  }

  if (field.type === 'select') {
    const options = field.options ?? fieldOptions[field.name] ?? [];
    return (
      <select {...commonProps} defaultValue={formatAdminValue(initialValue)}>
        {!field.required ? <option value="">None</option> : null}
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    );
  }

  if (field.type === 'json') {
    const jsonValue = typeof initialValue === 'object' && initialValue !== null
      ? JSON.stringify(initialValue, null, 2)
      : formatAdminValue(initialValue);
    return <textarea {...commonProps} defaultValue={jsonValue} rows={5} spellCheck={false} />;
  }

  return <input {...commonProps} defaultValue={formatAdminValue(initialValue)} />;
}

export function AdminRecordForm({
  resource,
  action,
  submitLabel,
  record,
  fieldOptions = {},
  actionName
}: {
  resource: AdminResource;
  action: string;
  submitLabel: string;
  record?: Record<string, unknown>;
  fieldOptions?: FieldOptions;
  actionName?: string;
}) {
  return (
    <form action={action} method="post" style={{ display: 'grid', gap: 14, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, background: '#ffffff' }}>
      {actionName ? <input type="hidden" name="_action" value={actionName} /> : null}
      {resource.fields.map(field => (
        <label key={field.name} style={labelStyle}>
          {field.label}
          {renderField(field, record, fieldOptions)}
          {field.helpText ? <span style={{ color: '#6b7280', fontSize: 12 }}>{field.helpText}</span> : null}
        </label>
      ))}
      <button type="submit" style={{ justifySelf: 'start', padding: '8px 14px' }}>{submitLabel}</button>
    </form>
  );
}

export function AdminRecordTable({
  resource,
  records
}: {
  resource: AdminResource;
  records: Array<Record<string, unknown>>;
}) {
  if (records.length === 0) {
    return <p>No records yet.</p>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff' }}>
        <thead>
          <tr>
            {resource.tableColumns.map(column => (
              <th key={column} align="left" style={{ borderBottom: '1px solid #e5e7eb', padding: 8 }}>{column}</th>
            ))}
            <th align="left" style={{ borderBottom: '1px solid #e5e7eb', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => {
            const id = String(record[resource.idField]);
            return (
              <tr key={id}>
                {resource.tableColumns.map(column => (
                  <td key={column} style={{ borderBottom: '1px solid #f3f4f6', padding: 8, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formatAdminValue(record[column])}
                  </td>
                ))}
                <td style={{ borderBottom: '1px solid #f3f4f6', padding: 8 }}>
                  <a href={`/admin/${resource.slug}/${id}/edit`}>Edit</a>
                  <form action={`/api/admin-crud/${resource.slug}/${id}`} method="post" style={{ display: 'inline', marginLeft: 12 }}>
                    <input type="hidden" name="_action" value="delete" />
                    <button type="submit">Delete</button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
