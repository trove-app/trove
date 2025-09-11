'use client';

import React, { useState, useEffect } from 'react';
import { 
  useDatabaseConnection, 
  type DatabaseConnectionCreate, 
  type DatabaseConnectionUpdate 
} from '../context/DatabaseConnectionContext';

interface ConnectionFormProps {
  connectionId?: number | null;
  onClose: () => void;
}

export default function ConnectionForm({ connectionId, onClose }: ConnectionFormProps) {
  const { connections, addConnection, updateConnection } = useDatabaseConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<DatabaseConnectionCreate>({
    name: '',
    connection_type: 'postgresql',
    host: '',
    port: 5432,
    database: '',
    username: '',
    password: '',
    ssl_mode: 'prefer',
  });

  // Load existing connection data for editing
  useEffect(() => {
    if (connectionId) {
      const connection = connections.find(conn => conn.id === connectionId);
      if (connection) {
        setFormData({
          name: connection.name,
          connection_type: connection.connection_type,
          host: connection.host,
          port: connection.port,
          database: connection.database,
          username: connection.username,
          password: '', // Don't pre-fill password for security
          ssl_mode: connection.ssl_mode,
        });
      }
    }
  }, [connectionId, connections]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (connectionId) {
        // Update existing connection - only send changed fields
        const updates: DatabaseConnectionUpdate = {};
        const original = connections.find(conn => conn.id === connectionId);
        
        if (!original) {
          throw new Error('Connection not found');
        }

        // Compare and include only changed fields
        if (formData.name !== original.name) updates.name = formData.name;
        if (formData.connection_type !== original.connection_type) updates.connection_type = formData.connection_type;
        if (formData.host !== original.host) updates.host = formData.host;
        if (formData.port !== original.port) updates.port = formData.port;
        if (formData.database !== original.database) updates.database = formData.database;
        if (formData.username !== original.username) updates.username = formData.username;
        if (formData.ssl_mode !== original.ssl_mode) updates.ssl_mode = formData.ssl_mode;
        
        // Include password if provided
        if (formData.password.trim()) {
          updates.password = formData.password;
        }

        await updateConnection(connectionId, updates);
      } else {
        // Create new connection
        await addConnection(formData);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Connection Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                   text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
          placeholder="my-database"
        />
      </div>

      <div>
        <label htmlFor="connection_type" className="block text-sm font-medium text-foreground mb-1">
          Database Type
        </label>
        <select
          id="connection_type"
          name="connection_type"
          value={formData.connection_type}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                   text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="postgresql">PostgreSQL</option>
          <option value="mysql">MySQL</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="host" className="block text-sm font-medium text-foreground mb-1">
            Host
          </label>
          <input
            type="text"
            id="host"
            name="host"
            value={formData.host}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                     text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="localhost"
          />
        </div>
        <div>
          <label htmlFor="port" className="block text-sm font-medium text-foreground mb-1">
            Port
          </label>
          <input
            type="number"
            id="port"
            name="port"
            value={formData.port}
            onChange={handleChange}
            required
            min="1"
            max="65535"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                     text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="database" className="block text-sm font-medium text-foreground mb-1">
          Database Name
        </label>
        <input
          type="text"
          id="database"
          name="database"
          value={formData.database}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                   text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
          placeholder="mydb"
        />
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                   text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
          placeholder="user"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
          Password {connectionId && <span className="text-muted-foreground text-xs">(leave blank to keep current)</span>}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!connectionId}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                   text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label htmlFor="ssl_mode" className="block text-sm font-medium text-foreground mb-1">
          SSL Mode
        </label>
        <select
          id="ssl_mode"
          name="ssl_mode"
          value={formData.ssl_mode}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                   text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="disable">Disable</option>
          <option value="allow">Allow</option>
          <option value="prefer">Prefer</option>
          <option value="require">Require</option>
          <option value="verify-ca">Verify CA</option>
          <option value="verify-full">Verify Full</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-accent hover:bg-accent/80 text-accent-foreground 
                   rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (connectionId ? 'Update Connection' : 'Create Connection')}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground 
                   rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}