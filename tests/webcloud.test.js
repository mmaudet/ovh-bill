/**
 * Tests for Web Cloud bill line classification
 *
 * The wordings below are OVH bill descriptions, French and English mixed, as
 * they appear on the same account. Domain names use the RFC 2606 reserved
 * examples: only the wording around them matters to the classifier.
 */

const { classifyWebCloud } = require('../data/classify');

describe('classifyWebCloud', () => {
  describe('domain names', () => {
    test('classifies renewal requests', () => {
      expect(classifyWebCloud('example.com - .com demande de renouvellement - 12 mois')).toBe('domain');
      expect(classifyWebCloud('example.net - .net demande de renouvellement premium - 12 mois')).toBe('domain');
      expect(classifyWebCloud('example.org - .org demande de renouvellement - from 31/08/2026 to 31/08/2027')).toBe('domain');
    });

    test('classifies English domain wordings', () => {
      expect(classifyWebCloud('example.com domain renewal')).toBe('domain');
      expect(classifyWebCloud('example.com domain registration')).toBe('domain');
    });
  });

  describe('DNS zones', () => {
    test('classifies zone renewals', () => {
      expect(classifyWebCloud('example.com - Zone DNS - Renouvellement')).toBe('dns_zone');
      expect(classifyWebCloud('example.com DNS zone rental')).toBe('dns_zone');
    });

    // A zone line also says "Renouvellement", so the zone test has to win
    test('does not fall through to the domain family', () => {
      expect(classifyWebCloud('example.org - Zone DNS - Renouvellement')).not.toBe('domain');
    });
  });

  describe('web hosting', () => {
    test('classifies hosting plans by offer name', () => {
      expect(classifyWebCloud('Performance 1 renewal (12 months)')).toBe('hosting');
      expect(classifyWebCloud('Performance 1 rental for 12 months')).toBe('hosting');
      expect(classifyWebCloud('Pro renewal (12 months)')).toBe('hosting');
      expect(classifyWebCloud('Freedom hosting')).toBe('hosting');
    });
  });

  describe('email', () => {
    test('classifies MX plans and hosting email options', () => {
      expect(classifyWebCloud('MX plan platform rental for 12 months')).toBe('email');
      expect(classifyWebCloud('MX plan account rental for 12 months')).toBe('email');
      expect(classifyWebCloud("Renouvellement de l'option email (5 comptes) liée à l'hébergement example.com")).toBe('email');
    });
  });

  describe('hosting options', () => {
    test('classifies databases, CDN and redirections', () => {
      expect(classifyWebCloud('Personal SQL option: 1 database of 250 MB - 11 months')).toBe('option');
      expect(classifyWebCloud('Renouvellement du SQL privé vp1-1')).toBe('option');
      expect(classifyWebCloud('CDN basic option rental for 12 months')).toBe('option');
      expect(classifyWebCloud('Redirection Redirection')).toBe('option');
    });

    test('uses the domain suffix when the wording is ambiguous', () => {
      expect(classifyWebCloud('Option renewal', 'example.com-optional-415983076')).toBe('option');
    });
  });

  describe('non Web Cloud lines', () => {
    test('returns null for cloud and dedicated lines', () => {
      expect(classifyWebCloud('Managed Kubernetes Service - Standard multi-zones (eu-west-par)')).toBeNull();
      expect(classifyWebCloud('Forfait mensuel pour une instance eg-30')).toBeNull();
      expect(classifyWebCloud('Stockage Standard - Bucket my-bucket sur la région gra')).toBeNull();
      expect(classifyWebCloud('IP Load Balancer zone RBX 1 month rental')).toBeNull();
    });

    test('returns null for empty input', () => {
      expect(classifyWebCloud('')).toBeNull();
      expect(classifyWebCloud(null)).toBeNull();
      expect(classifyWebCloud(undefined)).toBeNull();
    });
  });
});
