// src/widgets/table/Table.tsx
import { useState, useRef, useEffect } from 'react';
import { Test, Site, Status, Type } from '../../../shared/model';
import styles from './table.module.scss';
import { useNavigate } from 'react-router-dom';

interface TableProps {
  tests: Test[];
  sites: Site[];
}

const TYPE_DISPLAY: Record<Type, string> = {
  [Type.CLASSIC]: 'Classic',
  [Type.SERVER_SIDE]: 'Server-side',
  [Type.MVT]: 'MVT',
};

const STATUS_DISPLAY: Record<Status, string> = {
  [Status.DRAFT]: 'Draft',
  [Status.ONLINE]: 'Online',
  [Status.PAUSED]: 'Paused',
  [Status.STOPPED]: 'Stopped',
};

const STATUS_ORDER = ['Online', 'Paused', 'Stopped', 'Draft'];


function formatUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return url; // Fallback for invalid URLs
  }
}

export function Table({ tests, sites }: TableProps) {
  const navigate = useNavigate();
  const tableRef = useRef<HTMLDivElement>(null); // Ref for managing focus in the table

  const siteMap = sites.reduce<Record<number, string>>((acc, site) => {
    acc[site.id] = site.url;
    return acc;
  }, {});

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<keyof Test | 'site'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTests = [...filteredTests].sort((a, b) => {
    const aValue = getDisplayValue(a, sortColumn);
    const bValue = getDisplayValue(b, sortColumn);

    if (sortColumn === 'status') {
      const order = sortDirection === 'asc' ? STATUS_ORDER : [...STATUS_ORDER].reverse();
      return order.indexOf(aValue) - order.indexOf(bValue);
    } else {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });


  function getDisplayValue(test: Test, column: keyof Test | 'site'): string {
    switch (column) {
      case 'name':
        return test.name;
      case 'type':
        return TYPE_DISPLAY[test.type];
      case 'status':
        return STATUS_DISPLAY[test.status];
      case 'site':
        return formatUrl(siteMap[test.siteId] || '');
      default:
        return '';
    }
  }


  function handleSort(column: keyof Test | 'site') {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }

  const STATUS_COLORS: Record<Status, string> = {
    [Status.ONLINE]: '#2EE5AC',
    [Status.PAUSED]: '#FF8B52',
    [Status.STOPPED]: '#FE5C5C',
    [Status.DRAFT]: '#2A2A2A',
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && tableRef.current) {
        const cells = tableRef.current.querySelectorAll<HTMLElement>('[tabindex]');
        if (cells.length > 0) {
          const focused = document.activeElement as HTMLElement;
          let currentIndex = -1;

          cells.forEach((cell, index) => {
            if (cell === focused) {
              currentIndex = index;
            }
          });

          if (event.shiftKey) {
            if (currentIndex > 0) {
              cells[currentIndex - 1].focus();
              event.preventDefault();
            }
          } else {
            if (currentIndex < cells.length - 1) {
              cells[currentIndex + 1].focus();
              event.preventDefault();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.tableContainer}>
      {/* Search bar with test count inside input */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="What test are you looking for?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            aria-label="Search tests"
          />
          <span className={styles.testCount}>{filteredTests.length} tests</span>
        </div>
      </div>

      {/* No results message or table */}
      {filteredTests.length === 0 ? (
        <div className={styles.noResults}>
          <p>No tests found</p>
          <button
            onClick={() => setSearchTerm('')}
            className={styles.resetButton}
          >
            Reset
          </button>
        </div>
      ) : (
        <div className={styles.table} ref={tableRef}>
          {/* Table header with sortable columns */}
          <div className={styles.header}>
            {(['name', 'type', 'status', 'site'] as const).map((column) => (
              <div
                key={column}
                className={styles.headerCell}
                onClick={() => handleSort(column)}
              >
                {column.toUpperCase()}
                {sortColumn === column && (
                  <span>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
            ))}
            <div className={styles.headerCell}></div> {/* Button column */}
          </div>

          {/* Table rows with data and navigation */}
          {sortedTests.map((test) => {
            const statusColor = STATUS_COLORS[test.status];
            const siteUrl = siteMap[test.siteId] || '';
            return (
              <div
                key={test.id}
                className={styles.row}
                style={{ borderLeft: `5px solid ${statusColor}` }}
              >
                <div className={styles.cell} tabIndex={0}>
                  {test.name}
                </div>
                <div className={styles.cell} tabIndex={0}>
                  {TYPE_DISPLAY[test.type]}
                </div>
                <div
                  className={`${styles.cell} ${styles[`status-${test.status.toLowerCase()}`]}`}
                  tabIndex={0}
                >
                  {STATUS_DISPLAY[test.status]}
                </div>
                <div className={styles.cell} tabIndex={0}>
                  {siteUrl ? formatUrl(siteUrl) : 'Unknown site'}
                </div>
                <div className={styles.cell}>
                  <button
                    className={[
                      styles.button,
                      (test.status === Status.ONLINE || test.status === Status.PAUSED)
                        ? styles.buttonResults
                        : styles.buttonFinalize,
                    ].join(' ')}
                    onClick={() =>
                      navigate(
                        test.status === Status.ONLINE || test.status === Status.PAUSED
                          ? `/results/${test.id}`
                          : `/finalize/${test.id}`
                      )
                    }
                    tabIndex={0}
                  >
                    {test.status === Status.ONLINE || test.status === Status.PAUSED
                      ? 'Results'
                      : 'Finalize'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}